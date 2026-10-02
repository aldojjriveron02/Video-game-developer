import type { Dashboard, Reward, SkillsResponse } from "./contracts";
import {
  activityDurationPresets,
  getActivityDefinition,
  getActivityDurationPreset,
  getGatheringDefinition,
  getGatheringDefinitions,
  rewardForDuration,
} from "../content/gathering";
import { startActivityCommandSchema, type StartActivityCommand } from "./commands";
import { GameError } from "./errors";
import { progressionForXp, type Progression } from "./progression";
import { EQUIPMENT_SLOTS, getItemDefinition, type EquipmentSlot } from "../content/items";
import { parseEquipCommand, parseEquipmentSlot, type InventoryState, type InventoryView } from "./equipment";
import { skillDefinitions } from "../content/skills";

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
  status: "active" | "claimed" | "cancelled";
  startedAt: Date;
  finishesAt: Date;
  claimedAt: Date | null;
  cancelledAt: Date | null;
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
  skillLevelsGained: number;
  skillProgression: { skillId: string; progression: Progression } | null;
};

export type RepositoryDashboard = Omit<Dashboard, "gathering" | "gatheringActivities" | "progression" | "skills"> & {
  skillXp: { skillId: string; xp: number }[];
};

export interface GameRepository {
  resolveClerkIdentity(clerkUserId: string, displayName: string): Promise<Player>;
  getDashboard(playerId: string): Promise<RepositoryDashboard>;
  startActivity(playerId: string, command: StartActivityCommand): Promise<ActivityRecord>;
  cancelActivity(playerId: string, activityId: string): Promise<ActivityRecord>;
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
    const definitions = getGatheringDefinitions();
    const xpBySkill = new Map(dashboard.skillXp.map((entry) => [entry.skillId, entry.xp]));
    const { skillXp: _skillXp, ...base } = dashboard;
    return {
      ...base,
      progression: progressionForXp(dashboard.player.xp),
      skills: skillDefinitions.map((skill) => ({
        ...skill,
        ...progressionForXp(xpBySkill.get(skill.id) ?? 0),
      })),
      gathering: {
        id: definition.id,
        name: definition.name,
        description: definition.description,
        durationSeconds: definition.durationSeconds,
        reward: { ...definition.reward },
        durationOptions: activityDurationPresets.map((preset) => ({
          id: preset.id,
          label: preset.label,
          durationSeconds: preset.durationSeconds,
          reward: rewardForDuration(definition.reward, preset.id),
        })),
      },
      gatheringActivities: definitions.map((activity) => ({
        id: activity.id,
        name: activity.name,
        description: activity.description,
        durationSeconds: activity.durationSeconds,
        reward: { ...activity.reward },
        durationOptions: activityDurationPresets.map((preset) => ({
          id: preset.id,
          label: preset.label,
          durationSeconds: preset.durationSeconds,
          reward: rewardForDuration(activity.reward, preset.id),
        })),
      })),
    };
  }

  async skillsForPlayer(playerId: string): Promise<SkillsResponse> {
    const dashboard = await this.dashboardForPlayer(playerId);
    return { player: dashboard.player, skills: dashboard.skills };
  }

  async startActivity(playerId: string, input: unknown): Promise<ActivityRecord> {
    const command = parseStartActivityCommand(input);
    const definition = getActivityDefinition(command.definitionId);
    const duration = getActivityDurationPreset(command.durationId);
    if (!definition || !duration) {
      throw new GameError("invalid_request", "The requested activity is not available.");
    }
    return this.repository.startActivity(playerId, command);
  }

  async cancelActivity(playerId: string, activityId: string): Promise<ActivityRecord> {
    return this.repository.cancelActivity(playerId, activityId);
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