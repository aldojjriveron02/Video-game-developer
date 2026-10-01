import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { PostgresGameRepository } from "../../src/database/repository";
import { frontierSchema } from "../../src/database/schema";
import { GameService } from "../../src/game/service";
import type { FrontierDatabase } from "../../src/database/client";

describe("persistent inventory and equipment", () => {
  let admin: Pool;
  let pool: Pool;
  let database: FrontierDatabase;
  let repository: PostgresGameRepository;
  let service: GameService;
  let schema: string;
  beforeAll(async () => {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
    if (process.env.NODE_ENV === "production" || process.env.FRONTIER_MIGRATION_ENV === "production") {
      throw new Error("Equipment integration tests are disabled in production.");
    }
    schema = `frontier_eq_${randomUUID().replaceAll("-", "")}`;
    admin = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
    await admin.query(`CREATE SCHEMA "${schema}"`);
    pool = new Pool({
      connectionString: process.env.DATABASE_URL, max: 5,
      options: `-c search_path=${schema}`, application_name: "frontier-equipment-tests",
    });
    database = drizzle(pool, { schema: frontierSchema });
    await migrate(database, { migrationsFolder: `${process.cwd()}/src/database/migrations`, migrationsSchema: schema });
    repository = new PostgresGameRepository(database);
    service = new GameService(repository);
  });
  afterAll(async () => {
    await pool?.end();
    if (schema && admin) await admin.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
    await admin?.end();
  });
  const createPlayer = () => repository.resolveClerkIdentity(`equipment:${randomUUID()}`, "Equipment Explorer");

  it("grants two unique starter instances once under concurrent identity provisioning", async () => {
    const clerkId = `equipment:${randomUUID()}`;
    const [a, b] = await Promise.all([
      repository.resolveClerkIdentity(clerkId, "Starter Explorer"),
      new PostgresGameRepository(database).resolveClerkIdentity(clerkId, "Starter Explorer"),
    ]);
    expect(a.id).toBe(b.id);
    const first = await service.inventoryForPlayer(a.id);
    expect(first.equipment).toHaveLength(2);
    expect(new Set(first.equipment.map((e) => e.id)).size).toBe(2);
    expect(first.equipment.map((e) => e.item.id).sort()).toEqual(["field-axe", "work-vest"]);
    await repository.resolveClerkIdentity(clerkId, "Starter Explorer");
    expect((await service.inventoryForPlayer(a.id)).equipment).toEqual(first.equipment);
    expect(first.slots.every((slot) => slot.equipmentId === null)).toBe(true);
  });

  it("grants starter equipment once to a pre-milestone player without changing their saved resources", async () => {
    const playerId = randomUUID();
    const clerkId = `equipment:${randomUUID()}`;
    await pool.query("INSERT INTO players (id,display_name,gold,xp) VALUES ($1,'Returning Explorer',48,24)", [playerId]);
    await pool.query("INSERT INTO clerk_identities (clerk_user_id,player_id) VALUES ($1,$2)", [clerkId, playerId]);
    await pool.query("INSERT INTO inventory (player_id,item_id,quantity) VALUES ($1,'wood',12)", [playerId]);
    await repository.resolveClerkIdentity(clerkId, "Returning Explorer");
    await repository.resolveClerkIdentity(clerkId, "Returning Explorer");
    const view = await service.inventoryForPlayer(playerId);
    expect(view.player).toMatchObject({ gold: 48, xp: 24 });
    expect(view.progression.level).toBe(2);
    expect(view.resources).toEqual([{
      item: { id: "wood", name: "Wood", kind: "resource", description: expect.any(String) }, quantity: 12,
    }]);
    expect(view.equipment).toHaveLength(2);
    expect(view.equipment.every((entry) => entry.item.kind === "equipment")).toBe(true);
  });

  it("persists equip and unequip across new repository instances and same-identity return", async () => {
    const clerkId = `equipment:${randomUUID()}`;
    const player = await repository.resolveClerkIdentity(clerkId, "Returning Explorer");
    const initial = await service.inventoryForPlayer(player.id);
    const axe = initial.equipment.find((e) => e.item.id === "field-axe")!;
    const vest = initial.equipment.find((e) => e.item.id === "work-vest")!;
    await service.equipForPlayer(player.id, "hand", { instanceId: axe.id });
    await service.equipForPlayer(player.id, "body", { instanceId: vest.id });
    const fresh = new GameService(new PostgresGameRepository(database));
    const restored = await fresh.repositoryForIdentity(clerkId, "Returning Explorer");
    expect(restored.id).toBe(player.id);
    const equipped = await fresh.inventoryForPlayer(player.id);
    expect(equipped.slots.find((s) => s.slot === "hand")?.equipmentId).toBe(axe.id);
    expect(equipped.slots.find((s) => s.slot === "body")?.equipmentId).toBe(vest.id);
    await fresh.equipForPlayer(player.id, "hand", { instanceId: axe.id }); // retry
    await fresh.unequipForPlayer(player.id, "hand");
    await fresh.unequipForPlayer(player.id, "hand"); // empty-slot retry
    const after = await service.inventoryForPlayer(player.id);
    expect(after.slots.find((s) => s.slot === "hand")?.equipmentId).toBeNull();
    expect(after.slots.find((s) => s.slot === "body")?.equipmentId).toBe(vest.id);
    expect(after.equipment).toHaveLength(2);
    expect(after.player.gold).toBe(0);
    expect(after.player.xp).toBe(0);
  });

  it("rejects wrong slots, malformed commands, missing items and other-player ownership without writes", async () => {
    const owner = await createPlayer();
    const other = await createPlayer();
    const bag = await service.inventoryForPlayer(owner.id);
    const vest = bag.equipment.find((e) => e.item.id === "work-vest")!;
    await service.equipForPlayer(owner.id, "body", { instanceId: vest.id });
    const own = await service.inventoryForPlayer(owner.id);
    const foreign = await service.inventoryForPlayer(other.id);
    const axe = own.equipment.find((e) => e.item.id === "field-axe")!;
    await expect(service.equipForPlayer(owner.id, "body", { instanceId: axe.id }))
      .rejects.toMatchObject({ code: "invalid_equipment_slot" });
    await expect(service.equipForPlayer(owner.id, "feet", { instanceId: axe.id }))
      .rejects.toMatchObject({ code: "invalid_request" });
    await expect(service.equipForPlayer(owner.id, "hand", { instanceId: "wood" }))
      .rejects.toMatchObject({ code: "invalid_request" });
    await expect(service.equipForPlayer(owner.id, "hand", { instanceId: randomUUID() }))
      .rejects.toMatchObject({ code: "equipment_not_found" });
    await expect(service.equipForPlayer(other.id, "hand", { instanceId: axe.id }))
      .rejects.toMatchObject({ code: "equipment_not_found" });
    await expect(service.equipForPlayer(owner.id, "hand", { instanceId: axe.id, playerId: other.id }))
      .rejects.toMatchObject({ code: "invalid_request" });
    await expect(service.unequipForPlayer(owner.id, "feet")).rejects.toMatchObject({ code: "invalid_request" });
    expect(await service.inventoryForPlayer(owner.id)).toEqual(own);
    expect(await service.inventoryForPlayer(other.id)).toEqual(foreign);
  });

  it("serializes concurrent replacements and never loses an equipment instance", async () => {
    const player = await createPlayer();
    const initial = await service.inventoryForPlayer(player.id);
    const first = initial.equipment.find((e) => e.item.id === "field-axe")!;
    const second = randomUUID();
    await pool.query("INSERT INTO equipment_instances (id,player_id,item_id) VALUES ($1,$2,'field-axe')", [second, player.id]);
    await Promise.all([
      repository.equip(player.id, first.id, "hand"),
      new PostgresGameRepository(database).equip(player.id, second, "hand"),
    ]);
    const after = await service.inventoryForPlayer(player.id);
    expect(after.equipment).toHaveLength(3);
    expect(after.equipment.filter((e) => e.equippedSlot === "hand")).toHaveLength(1);
    expect([first.id, second]).toContain(after.slots.find((s) => s.slot === "hand")?.equipmentId);
  });
});