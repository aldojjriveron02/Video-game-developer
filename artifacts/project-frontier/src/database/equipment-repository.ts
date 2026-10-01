import "server-only";
import { sql } from "drizzle-orm";
import type { FrontierDatabase } from "./client";
import { getItemDefinition, STARTER_EQUIPMENT, type EquipmentSlot } from "../content/items";
import type { EquipmentRecord } from "../game/equipment";
import { GameError } from "../game/errors";

type DbRow = Record<string, unknown>;
const rows = (result: unknown) => (result as { rows: DbRow[] }).rows;

export async function grantStarterEquipment(
  database: Pick<FrontierDatabase, "execute">, playerId: string,
) {
  for (const itemId of STARTER_EQUIPMENT) {
    await database.execute(sql`
      INSERT INTO equipment_instances (player_id, item_id, grant_key)
      VALUES (${playerId}::uuid, ${itemId}, ${`starter:v1:${itemId}`})
      ON CONFLICT (player_id, grant_key) DO NOTHING
    `);
  }
}

export class EquipmentRepository {
  constructor(private readonly database: FrontierDatabase) {}

  async list(playerId: string): Promise<EquipmentRecord[]> {
    const result = await this.database.execute(sql`
      SELECT id, item_id, equipped_slot, acquired_at FROM equipment_instances
      WHERE player_id = ${playerId}::uuid ORDER BY acquired_at, id
    `);
    return rows(result).map((row) => ({
      id: String(row.id), itemId: String(row.item_id),
      equippedSlot: row.equipped_slot === null ? null : row.equipped_slot as EquipmentSlot,
      acquiredAt: (row.acquired_at instanceof Date ? row.acquired_at : new Date(String(row.acquired_at))).toISOString(),
    }));
  }

  async equip(playerId: string, instanceId: string, slot: EquipmentSlot): Promise<void> {
    await this.database.transaction(async (transaction) => {
      const player = rows(await transaction.execute(sql`
        SELECT id FROM players WHERE id = ${playerId}::uuid FOR UPDATE
      `))[0];
      if (!player) throw new GameError("unauthorized", "A player identity is required.");
      const item = rows(await transaction.execute(sql`
        SELECT id, item_id, equipped_slot FROM equipment_instances
        WHERE id = ${instanceId}::uuid AND player_id = ${playerId}::uuid FOR UPDATE
      `))[0];
      // Same response for missing and someone else's item: do not leak ownership.
      if (!item) throw new GameError("equipment_not_found", "That equipment is not in your inventory.");
      const definition = getItemDefinition(String(item.item_id));
      if (!definition || definition.kind !== "equipment") {
        throw new GameError("configuration_error", "Equipment definition is unavailable.");
      }
      if (definition.slot !== slot) {
        throw new GameError("invalid_equipment_slot", `${definition.name} belongs in the ${definition.slot} slot.`);
      }
      if (item.equipped_slot === slot) return;
      // Replacing gear returns the previous instance to the bag; nothing is deleted.
      await transaction.execute(sql`
        UPDATE equipment_instances SET equipped_slot = NULL
        WHERE player_id = ${playerId}::uuid AND equipped_slot = ${slot}
      `);
      await transaction.execute(sql`
        UPDATE equipment_instances SET equipped_slot = ${slot}
        WHERE id = ${instanceId}::uuid AND player_id = ${playerId}::uuid
      `);
    });
  }

  async unequip(playerId: string, slot: EquipmentSlot): Promise<void> {
    await this.database.transaction(async (transaction) => {
      const player = rows(await transaction.execute(sql`
        SELECT id FROM players WHERE id = ${playerId}::uuid FOR UPDATE
      `))[0];
      if (!player) throw new GameError("unauthorized", "A player identity is required.");
      await transaction.execute(sql`
        UPDATE equipment_instances SET equipped_slot = NULL
        WHERE player_id = ${playerId}::uuid AND equipped_slot = ${slot}
      `);
    });
  }
}