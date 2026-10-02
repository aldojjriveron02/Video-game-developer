import type { ActivityDefinition } from "./gathering";
import { getItemDefinition } from "./items";
import { getSkillDefinition } from "./skills";

const craftingDefinitions = [
  {
    id: "craft-lumber",
    name: "Saw lumber",
    description: "Process rough wood into useful construction lumber.",
    durationSeconds: 60,
    inputs: [{ itemId: "wood", quantity: 3 }],
    reward: { gold: 0, xp: 6, itemId: "lumber", quantity: 1, skillId: "carpentry", skillXp: 8 },
    version: 1,
  },
  {
    id: "cook-river-fish",
    name: "Cook river fish",
    description: "Prepare fresh fish into a durable travel meal.",
    durationSeconds: 60,
    inputs: [{ itemId: "river-fish", quantity: 2 }],
    reward: { gold: 0, xp: 6, itemId: "cooked-fish", quantity: 1, skillId: "cooking", skillXp: 8 },
    version: 1,
  },
  {
    id: "tan-hide",
    name: "Tan hide",
    description: "Work animal hide into leather for future equipment recipes.",
    durationSeconds: 60,
    inputs: [{ itemId: "hide", quantity: 2 }],
    reward: { gold: 0, xp: 6, itemId: "leather", quantity: 1, skillId: "leatherworking", skillXp: 8 },
    version: 1,
  },
  {
    id: "brew-herbal-tonic",
    name: "Brew herbal tonic",
    description: "Combine medicinal herbs and berries into a basic tonic.",
    durationSeconds: 60,
    inputs: [
      { itemId: "medicinal-herb", quantity: 2 },
      { itemId: "wild-berries", quantity: 1 },
    ],
    reward: { gold: 0, xp: 6, itemId: "herbal-tonic", quantity: 1, skillId: "alchemy", skillXp: 8 },
    version: 1,
  },
] satisfies ActivityDefinition[];

function validateCraftingDefinition(definition: ActivityDefinition): ActivityDefinition {
  const output = getItemDefinition(definition.reward.itemId);
  const skill = definition.reward.skillId ? getSkillDefinition(definition.reward.skillId) : undefined;
  const inputsValid = definition.inputs.length > 0 && definition.inputs.every((input) => {
    const item = getItemDefinition(input.itemId);
    return item?.kind === "resource" && Number.isInteger(input.quantity) && input.quantity > 0;
  });
  if (
    !definition.id ||
    !definition.name ||
    !definition.description ||
    !Number.isInteger(definition.durationSeconds) ||
    definition.durationSeconds <= 0 ||
    !Number.isInteger(definition.version) ||
    definition.version <= 0 ||
    output?.kind !== "resource" ||
    skill?.category !== "production" ||
    !Number.isInteger(definition.reward.xp) ||
    definition.reward.xp < 0 ||
    !Number.isInteger(definition.reward.quantity) ||
    definition.reward.quantity <= 0 ||
    definition.reward.skillXp == null ||
    !Number.isInteger(definition.reward.skillXp) ||
    definition.reward.skillXp <= 0 ||
    !inputsValid
  ) {
    throw new Error(`Invalid crafting definition: ${definition.id || "unknown"}`);
  }
  return definition;
}

const craftingMap = new Map(
  craftingDefinitions.map((definition) => {
    const validated = validateCraftingDefinition(definition);
    return [validated.id, validated] as const;
  }),
);

export function getCraftingActivityDefinition(id: string): ActivityDefinition | undefined {
  return craftingMap.get(id);
}

export function getCraftingDefinitions(): readonly ActivityDefinition[] {
  return [...craftingMap.values()];
}
