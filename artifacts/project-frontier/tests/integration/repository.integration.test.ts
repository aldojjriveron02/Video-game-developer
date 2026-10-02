import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { PostgresGameRepository } from "../../src/database/repository";
import { frontierSchema } from "../../src/database/schema";
import type { FrontierDatabase } from "../../src/database/client";
import { GameService } from "../../src/game/service";

describe("PostgreSQL game repository", () => {
  let adminPool: Pool;
  let testPool: Pool;
  let database: FrontierDatabase;
  let schemaName: string;
  let repository: PostgresGameRepository;

  beforeAll(async () => {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error("DATABASE_URL is required for PostgreSQL integration tests.");
    if (
      process.env.NODE_ENV === "production" ||
      process.env.FRONTIER_MIGRATION_ENV === "production"
    ) {
      throw new Error("PostgreSQL integration tests are disabled in production.");
    }

    schemaName = `frontier_it_${randomUUID().replaceAll("-", "")}`;
    adminPool = new Pool({ connectionString: databaseUrl, max: 1 });
    await adminPool.query(`CREATE SCHEMA "${schemaName}"`);

    testPool = new Pool({
      connectionString: databaseUrl,
      max: 5,
      options: `-c search_path=${schemaName}`,
      application_name: "project-frontier-integration-tests",
    });
    database = drizzle(testPool, { schema: frontierSchema });
    await migrate(database, {
      migrationsFolder: `${process.cwd()}/src/database/migrations`,
      migrationsSchema: schemaName,
    });
    repository = new PostgresGameRepository(database);
  });

  afterAll(async () => {
    await testPool?.end();
    if (schemaName && adminPool) {
      await adminPool.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);
    }
    await adminPool?.end();
  });

  async function createPlayer(suffix = randomUUID()) {
    return repository.resolveClerkIdentity(`integration:${suffix}`, "Integration Explorer");
  }

  async function markActivityReady(activityId: string) {
    await testPool.query(
      `WITH instant AS (SELECT clock_timestamp() AS now)
       UPDATE activities
       SET started_at = instant.now - INTERVAL '31 seconds',
           finishes_at = instant.now - INTERVAL '1 second'
       FROM instant
       WHERE id = $1`,
      [activityId],
    );
  }

  it("serializes concurrent first-time Clerk identity resolution", async () => {
    const clerkUserId = `integration:${randomUUID()}`;
    const [first, second] = await Promise.all([
      repository.resolveClerkIdentity(clerkUserId, "Integration Explorer"),
      new PostgresGameRepository(database).resolveClerkIdentity(
        clerkUserId,
        "Integration Explorer",
      ),
    ]);

    expect(first.id).toBe(second.id);
    const identityRows = await testPool.query(
      "SELECT player_id FROM clerk_identities WHERE clerk_user_id = $1",
      [clerkUserId],
    );
    const playerRows = await testPool.query(
      "SELECT id FROM players WHERE id = $1",
      [first.id],
    );
    expect(identityRows.rowCount).toBe(1);
    expect(playerRows.rowCount).toBe(1);
  });

  it("persists player and activity state across repository instances and returns retry starts", async () => {
    const player = await createPlayer();
    const requestId = randomUUID();
    const command = { definitionId: "gather-wood", requestId };
    const original = await repository.startActivity(player.id, command);
    const retry = await new PostgresGameRepository(database).startActivity(player.id, command);

    expect(retry.id).toBe(original.id);
    expect(original.finishesAt.getTime() - original.startedAt.getTime()).toBe(30_000);
    expect(retry.reward).toEqual({ gold: 12, xp: 8, itemId: "wood", quantity: 3 });

    const persistedDashboard = await new PostgresGameRepository(database).getDashboard(player.id);
    expect(persistedDashboard.activeActivity?.id).toBe(original.id);
    expect(persistedDashboard.player.id).toBe(player.id);
  });

  it("rejects early claims and rejects claims by a different owner", async () => {
    const owner = await createPlayer();
    const other = await createPlayer();
    const activity = await repository.startActivity(owner.id, {
      definitionId: "gather-wood",
      requestId: randomUUID(),
    });
    const beforeClaim = await repository.getDashboard(owner.id);

    await expect(repository.claimActivity(owner.id, activity.id)).rejects.toMatchObject({
      code: "activity_not_finished",
    });
    const afterEarlyClaim = await repository.getDashboard(owner.id);
    expect(afterEarlyClaim.player.gold).toBe(beforeClaim.player.gold);
    expect(afterEarlyClaim.player.xp).toBe(beforeClaim.player.xp);
    expect(afterEarlyClaim.inventory).toEqual(beforeClaim.inventory);
    expect(afterEarlyClaim.ledger).toEqual(beforeClaim.ledger);
    expect(afterEarlyClaim.activeActivity?.id).toBe(activity.id);

    await markActivityReady(activity.id);
    await expect(repository.claimActivity(other.id, activity.id)).rejects.toMatchObject({
      code: "activity_not_found",
    });
  });

  it("serializes concurrent starts and makes concurrent claims reward exactly once", async () => {
    const player = await createPlayer();
    const startCommand = { definitionId: "gather-wood", requestId: randomUUID() };
    const [firstStart, retryStart] = await Promise.all([
      repository.startActivity(player.id, startCommand),
      new PostgresGameRepository(database).startActivity(player.id, startCommand),
    ]);
    expect(firstStart.id).toBe(retryStart.id);

    const secondStart = repository.startActivity(player.id, {
      definitionId: "gather-wood",
      requestId: randomUUID(),
    });
    await expect(secondStart).rejects.toMatchObject({ code: "activity_already_active" });

    await markActivityReady(firstStart.id);
    const claimResults = await Promise.all([
      repository.claimActivity(player.id, firstStart.id),
      new PostgresGameRepository(database).claimActivity(player.id, firstStart.id),
    ]);
    expect(claimResults[0].ledger.id).toBe(claimResults[1].ledger.id);
    expect(claimResults[0].activity.status).toBe("claimed");

    const persistedClaim = await new PostgresGameRepository(database).claimActivity(
      player.id,
      firstStart.id,
    );
    expect(persistedClaim.activity).toEqual(claimResults[0].activity);
    expect(persistedClaim.ledger).toEqual(claimResults[0].ledger);
    expect(claimResults.filter((result) => result.rewardGranted)).toHaveLength(1);
    expect(persistedClaim.rewardGranted).toBe(false);
    expect(persistedClaim.levelsGained).toBe(0);

    const dashboard = await new PostgresGameRepository(database).getDashboard(player.id);
    expect(dashboard.player.gold).toBe(firstStart.reward.gold);
    expect(dashboard.player.xp).toBe(firstStart.reward.xp);
    expect(dashboard.inventory).toEqual([{ itemId: "wood", quantity: 3 }]);
    expect(dashboard.ledger).toHaveLength(1);
  });

  it("advances levels once and preserves resources/progression after re-resolving the same identity", async () => {
    const clerkId = `integration:${randomUUID()}`;
    const player = await repository.resolveClerkIdentity(clerkId, "Progression Explorer");
    // Boundary setup is confined to this test's disposable database schema.
    await testPool.query("UPDATE players SET xp = 16 WHERE id = $1", [player.id]);
    const activity = await repository.startActivity(player.id, {
      definitionId: "gather-wood", requestId: randomUUID(),
    });
    await markActivityReady(activity.id);
    const results = await Promise.all([
      repository.claimActivity(player.id, activity.id),
      new PostgresGameRepository(database).claimActivity(player.id, activity.id),
    ]);
    expect(results.filter((result) => result.rewardGranted)).toHaveLength(1);
    expect(results.reduce((total, result) => total + result.levelsGained, 0)).toBe(1);
    expect(results.every((result) => result.progression.level === 2)).toBe(true);
    const retry = await repository.claimActivity(player.id, activity.id);
    expect(retry.rewardGranted).toBe(false);
    expect(retry.levelsGained).toBe(0);

    const freshRepository = new PostgresGameRepository(database);
    const signedBackIn = await freshRepository.resolveClerkIdentity(clerkId, "Progression Explorer");
    expect(signedBackIn.id).toBe(player.id);
    const dashboard = await new GameService(freshRepository).dashboardForPlayer(signedBackIn.id);
    expect(dashboard.player).toMatchObject({ gold: 12, xp: 24 });
    expect(dashboard.progression).toEqual({
      level: 2, totalXp: 24, xpIntoLevel: 0, xpForNextLevel: 48, xpRemaining: 48,
    });
    expect(dashboard.inventory).toEqual([{ itemId: "wood", quantity: 3 }]);
    expect(dashboard.ledger).toHaveLength(1);
    expect(dashboard.activeActivity).toBeNull();
  });

  it("cancels active work without rewards and immediately permits another activity", async () => {
    const player = await createPlayer();
    const before = await repository.getDashboard(player.id);
    const activity = await repository.startActivity(player.id, {
      definitionId: "gather-wood",
      requestId: randomUUID(),
    });

    const cancelled = await repository.cancelActivity(player.id, activity.id);
    expect(cancelled.status).toBe("cancelled");
    expect(cancelled.cancelledAt).not.toBeNull();
    expect(cancelled.claimedAt).toBeNull();

    const retryCancel = await new PostgresGameRepository(database).cancelActivity(
      player.id,
      activity.id,
    );
    expect(retryCancel.id).toBe(activity.id);
    expect(retryCancel.status).toBe("cancelled");

    await expect(repository.claimActivity(player.id, activity.id)).rejects.toMatchObject({
      code: "activity_not_active",
    });

    const afterCancel = await repository.getDashboard(player.id);
    expect(afterCancel.player.gold).toBe(before.player.gold);
    expect(afterCancel.player.xp).toBe(before.player.xp);
    expect(afterCancel.inventory).toEqual(before.inventory);
    expect(afterCancel.ledger).toEqual(before.ledger);
    expect(afterCancel.activeActivity).toBeNull();

    const replacement = await repository.startActivity(player.id, {
      definitionId: "gather-wood",
      requestId: randomUUID(),
    });
    expect(replacement.status).toBe("active");
    expect(replacement.id).not.toBe(activity.id);
  });

  it("allows only one of two concurrent distinct starts", async () => {
    const player = await createPlayer();
    const results = await Promise.allSettled([
      repository.startActivity(player.id, {
        definitionId: "gather-wood",
        requestId: randomUUID(),
      }),
      new PostgresGameRepository(database).startActivity(player.id, {
        definitionId: "gather-wood",
        requestId: randomUUID(),
      }),
    ]);

    expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    expect(results.filter((result) => result.status === "rejected")).toHaveLength(1);
    const dashboard = await repository.getDashboard(player.id);
    expect(dashboard.activeActivity).not.toBeNull();
  });
});