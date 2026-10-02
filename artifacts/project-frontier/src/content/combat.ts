import type { ActivityDefinition } from "./gathering";
import { getItemDefinition } from "./items";
import { getSkillDefinition } from "./skills";

const combatDefinitions = [
  {
    id: "train-strength",
    name: "Strength circuit",
    description: "Heavy carries, strikes and resistance work that build raw combat power.",
    durationSeconds: 60,
    inputs: [],
    reward: { gold: 6, xp: 8, itemId: "training-mark", quantity: 1, skillId: "strength", skillXp: 10 },
    version: 1,
  },
  {
    id: "train-defense",
    name: "Defense drill",
    description: "Guard work, bracing and controlled contact focused on absorbing pressure.",
    durationSeconds: 60,
    inputs: [],
    reward: { gold: 6, xp: 8, itemId: "training-mark", quantity: 1, skillId: "defense", skillXp: 10 },
    version: 1,
  },
  {
    id: "train-dexterity",
    name: "Precision drill",
    description: "Target work and fine weapon control that improve accuracy and handling.",
    durationSeconds: 60,
    inputs: [],
    reward: { gold: 6, xp: 8, itemId: "training-mark", quantity: 1, skillId: "dexterity", skillXp: 10 },
    version: 1,
  },
  {
    id: "train-agility",
    name: "Agility course",
    description: "Footwork, changes of direction and evasive movement under time pressure.",
    durationSeconds: 60,
    inputs: [],
    reward: { gold: 6, xp: 8, itemId: "training-mark", quantity: 1, skillId: "agility", skillXp: 10 },
    version: 1,
  },
  {
    id: "train-vitality",
    name: "Endurance circuit",
    description: "Sustained conditioning that builds health, stamina and resistance.",
    durationSeconds: 60,
    inputs: [],
    reward: { gold: 6, xp: 8, itemId: "training-mark", quantity: 1, skillId: "vitality", skillXp: 10 },
    version: 1,
  },
  {
    id: "train-tactics",
    name: "Tactical exercises",
    description: "Scenario planning and encounter study focused on better combat decisions.",
    durationSeconds: 60,
    inputs: [],
    reward: { gold: 6, xp: 8, itemId: "training-mark", quantity: 1, skillId: "tactics", skillXp: 10 },
    version: 1,
  },
] satisfies ActivityDefinition[];

function validateCombatDefinition(definition: ActivityDefinition): ActivityDefinition {
  const output = getItemDefinition(definition.reward.itemId);
  const skill = definition.reward.skillId ? getSkillDefinition(definition.reward.skillId) : undefined;
  if (
    !definition.id ||
    !definition.name ||
    !definition.description ||
    definition.inputs.length !== 0 ||
    output?.kind !== "resource" ||
    skill?.category !== "combat" ||
    definition.reward.skillXp == null ||
    !Number.isInteger(definition.reward.skillXp) ||
    definition.reward.skillXp <= 0
  ) {
    throw new Error(`Invalid combat definition: ${definition.id || "unknown"}`);
  }
  return definition;
}

const combatMap = new Map(
  combatDefinitions.map((definition) => {
    const validated = validateCombatDefinition(definition);
    return [validated.id, validated] as const;
  }),
);

export function getCombatActivityDefinition(id: string): ActivityDefinition | undefined {
  return combatMap.get(id);
}

export function getCombatDefinitions(): readonly ActivityDefinition[] {
  return [...combatMap.values()];
}
