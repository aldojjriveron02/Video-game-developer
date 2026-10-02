import "server-only";
import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";
import type { FrontierDatabase } from "./client";
import type { Reward } from "../game/contracts";
import { GameError } from "../game/errors";
import { progressionForXp } from "../game/progression";
import { EquipmentRepository, grantStarterEquipment } from "./equipment-repository";
import type { EquipmentSlot } from "../content/items";
import type { InventoryState } from "../game/equipment";
import { getActivityDefinition } from "../content/gathering";
import type {
  ActivityRecord,
  ClaimedActivity,
  GameRepository as GameRepositoryContract,
  LedgerRecord,
  Player,
} from "../game/service";

type DbRow = Record<string, unknown>;

function rowsFrom(result: unknown): DbRow[] {
  return (result as { rows?: DbRow[] }).rows ?? [];
}

function asDate(value: unknown): Date {
  return value instanceof Date ? value : new Date(String(value));
}

function asReward(value: unknown): Reward {
  return (typeof value === "string" ? JSON.parse(value) : value) as Reward;
}

function mapPlayer(row: DbRow): Player {
  return {
    id: String(row.id),
    displayName: String(row.display_name),
    gold: Number(row.gold),
    xp: Number(row.xp),
    createdAt: asDate(row.created_at),
  };
}

function mapActivity(row: DbRow): ActivityRecord {
  return {
    id: String(row.id),
    definitionId: String(row.definition_id),
    status: row.status as ActivityRecord["status"],
    startedAt: asDate(row.started_at),
    finishesAt: asDate(row.finishes_at),
    claimedAt: row.claimed_at == null ? null : asDate(row.claimed_at),
    cancelledAt: row.cancelled_at == null ? null : asDate(row.cancelled_at),
    reward: asReward(row.reward),
  };
}

function mapLedger(row: DbRow): LedgerRecord {
  return {
    id: String(row.id),
    activityId: String(row.activity_id),
    kind: String(row.kind),
    reward: asReward(row.reward),
    createdAt: asDate(row.created_at),
  };
}

function activityView(activity: ActivityRecord) {
  return {
    ...activity,
    startedAt: activity.startedAt.toISOString(),
    finishesAt: activity.finishesAt.toISOString(),
    claimedAt: activity.claimedAt?.toISOString() ?? null,
    cancelledAt: activity.cancelledAt?.toISOString() ?? null,
  };
}

export class PostgresGameRepository implements GameRepositoryContract {
  private readonly equipmentRepository: EquipmentRepository;
  constructor(private readonly database: FrontierDatabase) {
    this.equipmentRepository = new EquipmentRepository(database);
  }

  async resolveClerkIdentity(clerkUserId: string, displayName: string): Promise<Player> {
    const normalizedName =
      displayName.trim().replace(/\s+/g, " ").slice(0, 80) || "Frontier Explorer";

    return this.database.transaction(async (transaction) => {
      await transaction.execute(
        sql`SELECT pg_advisory_xact_lock(hashtextextended(${clerkUserId}, 0))`,
      );
      const existing = rowsFrom(
        await transaction.execute(sql`
          SELECT p.id, p.display_name, p.gold, p.xp, p.created_at
          FROM clerk_identities AS identity
          JOIN players AS p ON p.id = identity.player_id
          WHERE identity.clerk_user_id = ${clerkUserId}
          LIMIT 1
        `),
      )[0];
      if (existing) {
        await grantStarterEquipment(transaction, String(existing.id));
        return mapPlayer(existing);
      }

      const playerId = randomUUID();
      await transaction.execute(sql`
        INSERT INTO players (id, display_name)
        VALUES (${playerId}::uuid, ${normalizedName})
      `);
      await transaction.execute(sql`
        INSERT INTO clerk_identities (clerk_user_id, player_id)
        VALUES (${clerkUserId}, ${playerId}::uuid)
      `);
      const created = rowsFrom(
        await transaction.execute(sql`
          SELECT id, display_name, gold, xp, created_at
          FROM players
          WHERE id = ${playerId}::uuid
        `),
      )[0];
      if (!created) throw new Error("New player row was not returned.");
      await grantStarterEquipment(transaction, playerId);
      return mapPlayer(created);
    });
  }

  async getInventory(playerId: string): Promise<InventoryState> {
    const [dashboard, equipment] = await Promise.all([
      this.getDashboard(playerId), this.equipmentRepository.list(playerId),
    ]);
    return { player: dashboard.player, resources: dashboard.inventory, equipment };
  }

  equip(playerId: string, instanceId: string, slot: EquipmentSlot) {
    return this.equipmentRepository.equip(playerId, instanceId, slot);
  }

  unequip(playerId: string, slot: EquipmentSlot) {
    return this.equipmentRepository.unequip(playerId, slot);
  }

  async getDashboard(playerId: string) {
    const player = rowsFrom(
      await this.database.execute(sql`
        SELECT id, display_name, gold, xp, created_at
        FROM players
        WHERE id = ${playerId}::uuid
      `),
    )[0];
    if (!player) throw new GameError("unauthorized", "A player identity is required.");

    const [serverTime, activityRows, inventoryRows, ledgerRows, skillRows] = await Promise.all([
      this.database.execute(sql`SELECT clock_timestamp() AS server_time`),
      this.database.execute(sql`
        SELECT id, definition_id, status, started_at, finishes_at, claimed_at, cancelled_at, reward
        FROM activities
        WHERE player_id = ${playerId}::uuid
        ORDER BY started_at DESC
        LIMIT 10
      `),
      this.database.execute(sql`
        SELECT item_id, quantity
        FROM inventory
        WHERE player_id = ${playerId}::uuid
        ORDER BY item_id
      `),
      this.database.execute(sql`
        SELECT id, activity_id, kind, reward, created_at
        FROM reward_ledger
        WHERE player_id = ${playerId}::uuid
        ORDER BY created_at DESC
        LIMIT 20
      `),
      this.database.execute(sql`
        SELECT skill_id, xp
        FROM player_skills
        WHERE player_id = ${playerId}::uuid
        ORDER BY skill_id
      `),
    ]);

    const activities = rowsFrom(activityRows).map(mapActivity);
    const activeActivity = activities.find((activity) => activity.status === "active") ?? null;
    const databaseTime = asDate(rowsFrom(serverTime)[0]?.server_time);

    return {
      serverTime: databaseTime.toISOString(),
      player: (() => {
        const mapped = mapPlayer(player);
        return {
          id: mapped.id,
          displayName: mapped.displayName,
          gold: mapped.gold,
          xp: mapped.xp,
          createdAt: mapped.createdAt.toISOString(),
        };
      })(),
      activeActivity: activeActivity ? activityView(activeActivity) : null,
      recentActivities: activities
        .filter((activity) => activity.status !== "active")
        .map(activityView),
      inventory: rowsFrom(inventoryRows).map((row) => ({
        itemId: String(row.item_id),
        quantity: Number(row.quantity),
      })),
      ledger: rowsFrom(ledgerRows).map((row) => {
        const entry = mapLedger(row);
        return {
          id: entry.id,
          activityId: entry.activityId,
          kind: entry.kind,
          reward: entry.reward,
          createdAt: entry.createdAt.toISOString(),
        };
      }),
      skillXp: rowsFrom(skillRows).map((row) => ({
        skillId: String(row.skill_id),
        xp: Number(row.xp),
      })),
    };
  }

  async startActivity(playerId: string, command: { definitionId: string; requestId: string }) {
    return this.database.transaction(async (transaction) => {
      const player = rowsFrom(
        await transaction.execute(
          sql`SELECT id FROM players WHERE id = ${playerId}::uuid FOR UPDATE`,
        ),
      )[0];
      if (!player) throw new GameError("unauthorized", "A player identity is required.");

      const previousRequest = rowsFrom(
        await transaction.execute(sql`
          SELECT id, definition_id, status, started_at, finishes_at, claimed_at, cancelled_at, reward
          FROM activities
          WHERE player_id = ${playerId}::uuid AND request_id = ${command.requestId}::uuid
          FOR UPDATE
        `),
      )[0];
      if (previousRequest) return mapActivity(previousRequest);

      const active = rowsFrom(
        await transaction.execute(sql`
          SELECT id
          FROM activities
          WHERE player_id = ${playerId}::uuid AND status = 'active'
          LIMIT 1
        `),
      )[0];
      if (active) {
        throw new GameError(
          "activity_already_active",
          "Claim the current activity before starting another.",
        );
      }

      const definition = getActivityDefinition(command.definitionId);
      if (!definition) {
        throw new GameError("invalid_request", "The requested activity is not available.");
      }
      const inserted = rowsFrom(
        await transaction.execute(sql`
          WITH instant AS (SELECT clock_timestamp() AS started_at)
          INSERT INTO activities (
            player_id, definition_id, status, request_id, started_at, finishes_at, reward
          )
          SELECT
            ${playerId}::uuid,
            ${definition.id},
            'active',
            ${command.requestId}::uuid,
            instant.started_at,
            instant.started_at + (${definition.durationSeconds} * INTERVAL '1 second'),
            ${JSON.stringify(definition.reward)}::jsonb
          FROM instant
          RETURNING id, definition_id, status, started_at, finishes_at, claimed_at, cancelled_at, reward
        `),
      )[0];
      if (!inserted) throw new Error("New activity row was not returned.");
      return mapActivity(inserted);
    });
  }

  async cancelActivity(playerId: string, activityId: string): Promise<ActivityRecord> {
    return this.database.transaction(async (transaction) => {
      const player = rowsFrom(
        await transaction.execute(
          sql`SELECT id FROM players WHERE id = ${playerId}::uuid FOR UPDATE`,
        ),
      )[0];
      if (!player) throw new GameError("activity_not_found", "The activity was not found.");

      const activityRow = rowsFrom(
        await transaction.execute(sql`
          SELECT id, definition_id, status, started_at, finishes_at, claimed_at, cancelled_at, reward
          FROM activities
          WHERE id = ${activityId}::uuid AND player_id = ${playerId}::uuid
          FOR UPDATE
        `),
      )[0];
      if (!activityRow) {
        throw new GameError("activity_not_found", "The activity was not found.");
      }

      const activity = mapActivity(activityRow);
      if (activity.status === "cancelled") return activity;
      if (activity.status !== "active") {
        throw new GameError("activity_not_active", "This activity is no longer active.");
      }

      const cancelledRow = rowsFrom(
        await transaction.execute(sql`
          WITH instant AS (SELECT clock_timestamp() AS cancelled_at)
          UPDATE activities
          SET status = 'cancelled', cancelled_at = instant.cancelled_at
          FROM instant
          WHERE id = ${activity.id}::uuid
            AND player_id = ${playerId}::uuid
            AND status = 'active'
          RETURNING id, definition_id, status, started_at, finishes_at, claimed_at, cancelled_at, reward
        `),
      )[0];
      if (!cancelledRow) {
        throw new GameError("activity_not_active", "This activity is no longer active.");
      }
      return mapActivity(cancelledRow);
    });
  }

  async claimActivity(playerId: string, activityId: string): Promise<ClaimedActivity> {
    return this.database.transaction(async (transaction) => {
      const player = rowsFrom(
        await transaction.execute(
          sql`SELECT id, xp FROM players WHERE id = ${playerId}::uuid FOR UPDATE`,
        ),
      )[0];
      if (!player) throw new GameError("activity_not_found", "The activity was not found.");

      const activityRow = rowsFrom(
        await transaction.execute(sql`
          SELECT id, definition_id, status, started_at, finishes_at, claimed_at, cancelled_at, reward
          FROM activities
          WHERE id = ${activityId}::uuid AND player_id = ${playerId}::uuid
          FOR UPDATE
        `),
      )[0];
      if (!activityRow) {
        throw new GameError("activity_not_found", "The activity was not found.");
      }
      const activity = mapActivity(activityRow);

      if (activity.status === "cancelled") {
        throw new GameError("activity_not_active", "Cancelled activities cannot be claimed.");
      }

      if (activity.status === "claimed") {
        const savedLedger = rowsFrom(
          await transaction.execute(sql`
            SELECT id, activity_id, kind, reward, created_at
            FROM reward_ledger
            WHERE activity_id = ${activity.id}::uuid AND kind = 'activity_reward'
            LIMIT 1
          `),
        )[0];
        if (!savedLedger) throw new Error("Claimed activity is missing its reward ledger entry.");
        let skillProgression: ClaimedActivity["skillProgression"] = null;
        if (activity.reward.skillId) {
          const skill = rowsFrom(
            await transaction.execute(sql`
              SELECT xp
              FROM player_skills
              WHERE player_id = ${playerId}::uuid AND skill_id = ${activity.reward.skillId}
              LIMIT 1
            `),
          )[0];
          if (skill) {
            skillProgression = {
              skillId: activity.reward.skillId,
              progression: progressionForXp(Number(skill.xp)),
            };
          }
        }
        return {
          activity,
          ledger: mapLedger(savedLedger),
          rewardGranted: false,
          levelsGained: 0,
          progression: progressionForXp(Number(player.xp)),
          skillLevelsGained: 0,
          skillProgression,
        };
      }

      const nowRow = rowsFrom(
        await transaction.execute(sql`SELECT clock_timestamp() AS server_time`),
      )[0];
      const serverTime = asDate(nowRow?.server_time);
      if (serverTime < activity.finishesAt) {
        throw new GameError("activity_not_finished", "This activity is not finished yet.");
      }

      const reward = activity.reward;
      const beforeProgression = progressionForXp(Number(player.xp));
      const afterProgression = progressionForXp(Number(player.xp) + reward.xp);
      const claimedRow = rowsFrom(
        await transaction.execute(sql`
          UPDATE activities
          SET status = 'claimed', claimed_at = ${serverTime}
          WHERE id = ${activity.id}::uuid AND player_id = ${playerId}::uuid
          RETURNING id, definition_id, status, started_at, finishes_at, claimed_at, cancelled_at, reward
        `),
      )[0];
      await transaction.execute(sql`
        UPDATE players
        SET gold = gold + ${reward.gold}, xp = xp + ${reward.xp}
        WHERE id = ${playerId}::uuid
      `);
      await transaction.execute(sql`
        INSERT INTO inventory (player_id, item_id, quantity)
        VALUES (${playerId}::uuid, ${reward.itemId}, ${reward.quantity})
        ON CONFLICT (player_id, item_id)
        DO UPDATE SET quantity = inventory.quantity + EXCLUDED.quantity
      `);

      let skillLevelsGained = 0;
      let skillProgression: ClaimedActivity["skillProgression"] = null;
      if (reward.skillId && reward.skillXp) {
        const skillRow = rowsFrom(
          await transaction.execute(sql`
            INSERT INTO player_skills (player_id, skill_id, xp, updated_at)
            VALUES (${playerId}::uuid, ${reward.skillId}, ${reward.skillXp}, ${serverTime})
            ON CONFLICT (player_id, skill_id)
            DO UPDATE SET
              xp = player_skills.xp + EXCLUDED.xp,
              updated_at = EXCLUDED.updated_at
            RETURNING xp
          `),
        )[0];
        if (!skillRow) throw new Error("Skill reward was not persisted.");
        const afterSkillXp = Number(skillRow.xp);
        const beforeSkillXp = afterSkillXp - reward.skillXp;
        const beforeSkillProgression = progressionForXp(beforeSkillXp);
        const afterSkillProgression = progressionForXp(afterSkillXp);
        skillLevelsGained = afterSkillProgression.level - beforeSkillProgression.level;
        skillProgression = {
          skillId: reward.skillId,
          progression: afterSkillProgression,
        };
      }

      const ledgerRow = rowsFrom(
        await transaction.execute(sql`
          INSERT INTO reward_ledger (player_id, activity_id, kind, reward, created_at)
          VALUES (
            ${playerId}::uuid,
            ${activity.id}::uuid,
            'activity_reward',
            ${JSON.stringify(reward)}::jsonb,
            ${serverTime}
          )
          RETURNING id, activity_id, kind, reward, created_at
        `),
      )[0];
      if (!claimedRow || !ledgerRow) throw new Error("Reward claim was not persisted.");
      return {
        activity: mapActivity(claimedRow),
        ledger: mapLedger(ledgerRow),
        rewardGranted: true,
        levelsGained: afterProgression.level - beforeProgression.level,
        progression: afterProgression,
        skillLevelsGained,
        skillProgression,
      };
    });
  }
}