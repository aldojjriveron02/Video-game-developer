import type { Reward } from "../game/contracts";
import { getSkillDefinition } from "./skills";

export type ActivityDefinition = {
  id: string;
  name: string;
  description: string;
  durationSeconds: number;
  reward: Reward;
  version: number;
};

const gatheringDefinitions = [
  {
    id: "gather-wood",
    name: "Gather wood",
    description: "Collect sturdy wood from the nearby forest.",
    durationSeconds: 30,
    reward: {
      gold: 12,
      xp: 8,
      itemId: "wood",
      quantity: 3,
      skillId: "woodcutting",
      skillXp: 8,
    },
    version: 1,
  },
] satisfies ActivityDefinition[];

function validateDefinition(definition: ActivityDefinition): ActivityDefinition {
  if (
    !definition.id ||
    !definition.name ||
    !definition.description ||
    !Number.isInteger(definition.durationSeconds) ||
    definition.durationSeconds <= 0 ||
    !Number.isInteger(definition.version) ||
    definition.version <= 0 ||
    !definition.reward.itemId ||
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

export function getActivityDefinition(id: string): ActivityDefinition | undefined {
  return activityDefinitions.get(id);
}

export function getGatheringDefinition(): ActivityDefinition {
  const definition = getActivityDefinition("gather-wood");
  if (!definition) {
    throw new Error("Required activity definition gather-wood is missing.");
  }
  return definition;
}