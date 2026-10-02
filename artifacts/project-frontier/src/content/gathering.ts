import type { ResourceCost, Reward } from "../game/contracts";
import { getSkillDefinition } from "./skills";
import { getItemDefinition } from "./items";

export type ActivityDefinition = {
  id: string;
  name: string;
  description: string;
  durationSeconds: number;
  reward: Reward;
  inputs: ResourceCost[];
  version: number;
};

export type ActivityDurationPreset = {
  id: "1m" | "5m" | "15m" | "1h" | "4h" | "8h";
  label: string;
  durationSeconds: number;
  rewardMultiplier: number;
};

export const activityDurationPresets: readonly ActivityDurationPreset[] = [
  { id: "1m", label: "1 minute", durationSeconds: 60, rewardMultiplier: 1 },
  { id: "5m", label: "5 minutes", durationSeconds: 300, rewardMultiplier: 5 },
  { id: "15m", label: "15 minutes", durationSeconds: 900, rewardMultiplier: 15 },
  { id: "1h", label: "1 hour", durationSeconds: 3600, rewardMultiplier: 60 },
  { id: "4h", label: "4 hours", durationSeconds: 14400, rewardMultiplier: 240 },
  { id: "8h", label: "8 hours", durationSeconds: 28800, rewardMultiplier: 480 },
];

const gatheringDefinitions = [
  {
    id: "gather-wood",
    name: "Gather wood",
    description: "Collect sturdy wood from the nearby forest.",
    durationSeconds: 60,
    inputs: [],
    reward: { gold: 12, xp: 8, itemId: "wood", quantity: 3, skillId: "woodcutting", skillXp: 8 },
    version: 2,
  },
  {
    id: "mine-stone",
    name: "Mine stone",
    description: "Break usable stone from shallow frontier deposits.",
    durationSeconds: 60,
    inputs: [],
    reward: { gold: 12, xp: 8, itemId: "stone", quantity: 3, skillId: "mining", skillXp: 8 },
    version: 2,
  },
  {
    id: "mine-iron-ore",
    name: "Mine iron ore",
    description: "Extract iron-bearing ore from harder frontier rock.",
    durationSeconds: 60,
    inputs: [],
    reward: { gold: 12, xp: 8, itemId: "iron-ore", quantity: 2, skillId: "mining", skillXp: 8 },
    version: 1,
  },
  {
    id: "fish-river",
    name: "Fish the river",
    description: "Work the nearby water for fresh river fish.",
    durationSeconds: 60,
    inputs: [],
    reward: { gold: 12, xp: 8, itemId: "river-fish", quantity: 2, skillId: "fishing", skillXp: 8 },
    version: 2,
  },
  {
    id: "hunt-small-game",
    name: "Hunt small game",
    description: "Track nearby wildlife for hides and useful materials.",
    durationSeconds: 60,
    inputs: [],
    reward: { gold: 12, xp: 8, itemId: "hide", quantity: 2, skillId: "hunting", skillXp: 8 },
    version: 2,
  },
  {
    id: "gather-herbs",
    name: "Gather herbs",
    description: "Collect common medicinal plants from the frontier.",
    durationSeconds: 60,
    inputs: [],
    reward: { gold: 12, xp: 8, itemId: "medicinal-herb", quantity: 3, skillId: "herbalism", skillXp: 8 },
    version: 2,
  },
  {
    id: "gather-plant-fiber",
    name: "Gather plant fiber",
    description: "Collect tough grasses and fibers suitable for textile work.",
    durationSeconds: 60,
    inputs: [],
    reward: { gold: 12, xp: 8, itemId: "plant-fiber", quantity: 3, skillId: "foraging", skillXp: 8 },
    version: 1,
  },
  {
    id: "forage-berries",
    name: "Forage berries",
    description: "Search the nearby wilds for edible berries and supplies.",
    durationSeconds: 60,
    inputs: [],
    reward: { gold: 12, xp: 8, itemId: "wild-berries", quantity: 3, skillId: "foraging", skillXp: 8 },
    version: 2,
  },
] satisfies ActivityDefinition[];

function validateDefinition(definition: ActivityDefinition): ActivityDefinition {
  const item = getItemDefinition(definition.reward.itemId);
  if (
    !definition.id ||
    !definition.name ||
    !definition.description ||
    !Number.isInteger(definition.durationSeconds) ||
    definition.durationSeconds <= 0 ||
    !Number.isInteger(definition.version) ||
    definition.version <= 0 ||
    !definition.reward.itemId ||
    !item ||
    item.kind !== "resource" ||
    !Number.isInteger(definition.reward.gold) ||
    definition.reward.gold < 0 ||
    !Number.isInteger(definition.reward.xp) ||
    definition.reward.xp < 0 ||
    !Number.isInteger(definition.reward.quantity) ||
    definition.reward.quantity <= 0 ||
    ((definition.reward.skillId == null) !== (definition.reward.skillXp == null)) ||
    (definition.reward.skillId != null && !getSkillDefinition(definition.reward.skillId)) ||
    (definition.reward.skillXp != null &&
      (!Number.isInteger(definition.reward.skillXp) || definition.reward.skillXp <= 0))
  ) {
    throw new Error(`Invalid activity definition: ${definition.id || "unknown"}`);
  }
  return definition;
}

export const activityDefinitions = new Map(
  gatheringDefinitions.map((definition) => {
    const validated = validateDefinition(definition);
    return [validated.id, validated] as const;
  }),
);

export function getGatheringActivityDefinition(id: string): ActivityDefinition | undefined {
  return activityDefinitions.get(id);
}

export function getGatheringDefinitions(): readonly ActivityDefinition[] {
  return [...activityDefinitions.values()];
}

export function getGatheringDefinition(): ActivityDefinition {
  const definition = getGatheringActivityDefinition("gather-wood");
  if (!definition) {
    throw new Error("Required activity definition gather-wood is missing.");
  }
  return definition;
}

export function getActivityDurationPreset(id: string): ActivityDurationPreset | undefined {
  return activityDurationPresets.find((preset) => preset.id === id);
}

export function rewardForDuration(reward: Reward, durationId: string): Reward {
  const preset = getActivityDurationPreset(durationId);
  if (!preset) throw new Error("Unknown activity duration preset.");
  return {
    ...reward,
    gold: reward.gold * preset.rewardMultiplier,
    xp: reward.xp * preset.rewardMultiplier,
    quantity: reward.quantity * preset.rewardMultiplier,
    skillXp: reward.skillXp == null ? undefined : reward.skillXp * preset.rewardMultiplier,
  };
}

export function inputsForDuration(inputs: readonly ResourceCost[], durationId: string): ResourceCost[] {
  const preset = getActivityDurationPreset(durationId);
  if (!preset) throw new Error("Unknown activity duration preset.");
  return inputs.map((input) => ({
    itemId: input.itemId,
    quantity: input.quantity * preset.rewardMultiplier,
  }));
}
