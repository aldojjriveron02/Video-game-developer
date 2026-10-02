import {
  check,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { Reward } from "../game/contracts";
import type { EquipmentSlot } from "../content/items";

export const players = pgTable(
  "players",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    displayName: varchar("display_name", { length: 80 }).notNull(),
    gold: integer("gold").notNull().default(0),
    xp: integer("xp").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("players_gold_nonnegative", sql`${table.gold} >= 0`),
    check("players_xp_nonnegative", sql`${table.xp} >= 0`),
  ],
);

export const clerkIdentities = pgTable(
  "clerk_identities",
  {
    clerkUserId: text("clerk_user_id").primaryKey(),
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("clerk_identities_player_id_unique").on(table.playerId)],
);

export const activities = pgTable(
  "activities",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    definitionId: text("definition_id").notNull(),
    status: varchar("status", { length: 16 }).$type<"active" | "claimed" | "cancelled">().notNull(),
    requestId: uuid("request_id").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true, mode: "date" }).notNull(),
    finishesAt: timestamp("finishes_at", { withTimezone: true, mode: "date" }).notNull(),
    claimedAt: timestamp("claimed_at", { withTimezone: true, mode: "date" }),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true, mode: "date" }),
    reward: jsonb("reward").$type<Reward>().notNull(),
  },
  (table) => [
    uniqueIndex("activities_player_request_unique").on(table.playerId, table.requestId),
    uniqueIndex("activities_player_id_id_unique").on(table.playerId, table.id),
    uniqueIndex("activities_one_active_per_player")
      .on(table.playerId)
      .where(sql`${table.status} = 'active'`),
    index("activities_player_started_idx").on(table.playerId, table.startedAt),
    check("activities_status_valid", sql`${table.status} IN ('active', 'claimed', 'cancelled')`),
    check(
      "activities_terminal_timestamp_consistent",
      sql`(${table.status} = 'active' AND ${table.claimedAt} IS NULL AND ${table.cancelledAt} IS NULL)
        OR (${table.status} = 'claimed' AND ${table.claimedAt} IS NOT NULL AND ${table.cancelledAt} IS NULL)
        OR (${table.status} = 'cancelled' AND ${table.claimedAt} IS NULL AND ${table.cancelledAt} IS NOT NULL)`,
    ),
    check("activities_finishes_after_start", sql`${table.finishesAt} > ${table.startedAt}`),
  ],
);

export const inventory = pgTable(
  "inventory",
  {
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    itemId: text("item_id").notNull(),
    quantity: integer("quantity").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.playerId, table.itemId] }),
    check("inventory_quantity_positive", sql`${table.quantity} > 0`),
  ],
);

export const playerSkills = pgTable(
  "player_skills",
  {
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    skillId: varchar("skill_id", { length: 32 }).notNull(),
    xp: integer("xp").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.playerId, table.skillId] }),
    check("player_skills_xp_nonnegative", sql`${table.xp} >= 0`),
  ],
);

export const rewardLedger = pgTable(
  "reward_ledger",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    activityId: uuid("activity_id")
      .notNull()
      .references(() => activities.id, { onDelete: "cascade" }),
    kind: varchar("kind", { length: 32 }).notNull(),
    reward: jsonb("reward").$type<Reward>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("reward_ledger_activity_kind_unique").on(table.activityId, table.kind),
    index("reward_ledger_player_created_idx").on(table.playerId, table.createdAt),
  ],
);

export const equipmentInstances = pgTable(
  "equipment_instances",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    playerId: uuid("player_id").notNull().references(() => players.id, { onDelete: "cascade" }),
    itemId: text("item_id").notNull(),
    grantKey: text("grant_key"),
    equippedSlot: varchar("equipped_slot", { length: 16 }).$type<EquipmentSlot>(),
    acquiredAt: timestamp("acquired_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("equipment_starter_grant_unique").on(table.playerId, table.grantKey),
    uniqueIndex("equipment_one_item_per_slot").on(table.playerId, table.equippedSlot)
      .where(sql`${table.equippedSlot} IS NOT NULL`),
    index("equipment_player_acquired_idx").on(table.playerId, table.acquiredAt),
    check("equipment_slot_valid", sql`${table.equippedSlot} IS NULL OR ${table.equippedSlot} IN ('hand', 'body', 'head')`),
  ],
);

export const frontierSchema = {
  players,
  clerkIdentities,
  activities,
  inventory,
  playerSkills,
  rewardLedger,
  equipmentInstances,
};