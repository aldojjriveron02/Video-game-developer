import type { Dashboard, Reward } from "./contracts";
import { getActivityDefinition, getGatheringDefinition } from "../content/gathering";
import { startActivityCommandSchema, type StartActivityCommand } from "./commands";
import { GameError } from "./errors";
import { progressionForXp, type Progression } from "./progression";
import { EQUIPMENT_SLOTS, getItemDefinition, type EquipmentSlot } from "../content/items";
import { parseEquipCommand, parseEquipmentSlot, type InventoryState, type InventoryView } from "./equipment";

export type Player = {
  id: string;
  displayName: string;
  gold: number;
  xp: number;
  createdAt: Date;
};

export type ActivityRecord = {
  id: string;
  definitionId: string;
  status: "active" | "claimed";
  startedAt: Date;
  finishesAt: Date;
  claimedAt: Date | null;
  reward: Reward;
};

export type LedgerRecord = {
  id: string;
  activityId: string;
  kind: string;
  reward: Reward;
  createdAt: Date;
};

export type ClaimedActivity = {
  activity: ActivityRecord;
  ledger: LedgerRecord;
  rewardGranted: boolean;
  levelsGained: number;
  progression: Progression;
};

export interface GameRepository {
  resolveClerkIdentity(clerkUserId: string, displayName: string): Promise<Player>;
  getDashboard(playerId: string): Promise<Omit<Dashboard, "gathering" | "progression">>;
  startActivity(playerId: string, command: StartActivityCommand): Promise<ActivityRecord>;
  claimActivity(playerId: string, activityId: string): Promise<ClaimedActivity>;
  getInventory(playerId: string): Promise<InventoryState>;
  equip(playerId: string, instanceId: string, slot: EquipmentSlot): Promise<void>;
  unequip(playerId: string, slot: EquipmentSlot): Promise<void>;
}

export function parseStartActivityCommand(input: unknown): StartActivityCommand {
  const parsed = startActivityCommandSchema.safeParse(input);
  if (!parsed.success) {
    throw new GameError("invalid_request", "The activity request is invalid.");
  }
  return parsed.data;
}

export class GameService {
  constructor(private readonly repository: GameRepository) {}

  repositoryForIdentity(clerkUserId: string, displayName: string): Promise<Player> {
    return this.repository.resolveClerkIdentity(clerkUserId, displayName);
  }

  async dashboardForPlayer(playerId: string): Promise<Dashboard> {
    const dashboard = await this.repository.getDashboard(playerId);
    const definition = getGatheringDefinition();
    return {
      ...dashboard,
      progression: progressionForXp(dashboard.player.xp),
      gathering: {
        id: definition.id,
        name: definition.name,
        description: definition.description,
        durationSeconds: definition.durationSeconds,
        reward: { ...definition.reward },
      },
    };
  }

  async startActivity(playerId: string, input: unknown): Promise<ActivityRecord> {
    const command = parseStartActivityCommand(input);
    const definition = getActivityDefinition(command.definitionId);
    if (!definition) {
      throw new GameError("invalid_request", "The requested activity is not available.");
    }
    return this.repository.startActivity(playerId, command);
  }

  async claimActivity(playerId: string, activityId: string): Promise<ClaimedActivity> {
    return this.repository.claimActivity(playerId, activityId);
  }

  async inventoryForPlayer(playerId: string): Promise<InventoryView> {
    const state = await this.repository.getInventory(playerId);
    const equipment = state.equipment.map((entry) => {
      const item = getItemDefinition(entry.itemId);
      if (!item || item.kind !== "equipment") {
        throw new GameError("configuration_error", "Equipment definition is unavailable.");
      }
      return { id: entry.id, item, equippedSlot: entry.equippedSlot, acquiredAt: entry.acquiredAt };
    });
    return {
      player: state.player,
      progression: progressionForXp(state.player.xp),
      resources: state.resources.map((entry) => {
        const item = getItemDefinition(entry.itemId);
        if (!item || item.kind !== "resource") {
          throw new GameError("configuration_error", "Resource definition is unavailable.");
        }
        return { item, quantity: entry.quantity };
      }),
      equipment,
      slots: EQUIPMENT_SLOTS.map(({ id, label }) => ({
        slot: id, label, equipmentId: equipment.find((entry) => entry.equippedSlot === id)?.id ?? null,
      })),
    };
  }

  async equipForPlayer(playerId: string, rawSlot: unknown, input: unknown): Promise<InventoryView> {
    const slot = parseEquipmentSlot(rawSlot);
    const { instanceId } = parseEquipCommand(input);
    await this.repository.equip(playerId, instanceId, slot);
    return this.inventoryForPlayer(playerId);
  }

  async unequipForPlayer(playerId: string, rawSlot: unknown): Promise<InventoryView> {
    const slot = parseEquipmentSlot(rawSlot);
    await this.repository.unequip(playerId, slot);
    return this.inventoryForPlayer(playerId);
  }
}