import type { ActivityDefinition } from "./gathering";

export type QuestDefinition = ActivityDefinition & {
  regionName: string;
  objective: string;
  requiredQuestId?: string;
};

const quests = [
  {
    id: "quest-station-timber",
    name: "Rebuild the Stockade",
    description: "The station needs a dependable timber reserve before operations can expand.",
    objective: "Deliver 12 Wood to the station quartermaster.",
    regionName: "Field Station",
    durationSeconds: 60,
    inputs: [{ itemId: "wood", quantity: 12 }],
    reward: { gold: 45, xp: 30, itemId: "training-mark", quantity: 2 },
    version: 1,
  },
  {
    id: "quest-quarry-foundation",
    name: "Foundation Stone",
    description: "Reinforce the field station before pushing deeper into the frontier.",
    objective: "Deliver 12 Stone for wall and foundation repairs.",
    regionName: "Pine Verge",
    requiredQuestId: "quest-station-timber",
    durationSeconds: 60,
    inputs: [{ itemId: "stone", quantity: 12 }],
    reward: { gold: 55, xp: 36, itemId: "training-mark", quantity: 2 },
    version: 1,
  },
  {
    id: "quest-trail-rations",
    name: "Trail Rations",
    description: "Patrols need durable food before longer missions along the Rust Trail.",
    objective: "Deliver 6 Cooked Fish and 6 Wild Berries.",
    regionName: "Pine Verge",
    requiredQuestId: "quest-quarry-foundation",
    durationSeconds: 60,
    inputs: [
      { itemId: "cooked-fish", quantity: 6 },
      { itemId: "wild-berries", quantity: 6 },
    ],
    reward: { gold: 75, xp: 48, itemId: "training-mark", quantity: 3 },
    version: 1,
  },
  {
    id: "quest-rust-trail-supply",
    name: "Secure the Rust Trail",
    description: "Build a reinforced supply cache to support combat operations against the raiders.",
    objective: "Deliver 8 Lumber, 6 Iron Ingots and 4 Leather.",
    regionName: "Rust Trail",
    requiredQuestId: "quest-trail-rations",
    durationSeconds: 60,
    inputs: [
      { itemId: "lumber", quantity: 8 },
      { itemId: "iron-ingot", quantity: 6 },
      { itemId: "leather", quantity: 4 },
    ],
    reward: {
      gold: 110,
      xp: 72,
      itemId: "training-mark",
      quantity: 4,
      equipmentDropId: "quarry-helm",
    },
    version: 1,
  },
  {
    id: "quest-outpost-restoration",
    name: "Restore the Old Outpost",
    description: "Repair the ruined outpost and establish the first permanent station beyond the trail.",
    objective: "Deliver 12 Lumber, 10 Iron Ingots, 8 Cloth and 6 Herbal Tonics.",
    regionName: "Ruined Outpost",
    requiredQuestId: "quest-rust-trail-supply",
    durationSeconds: 60,
    inputs: [
      { itemId: "lumber", quantity: 12 },
      { itemId: "iron-ingot", quantity: 10 },
      { itemId: "cloth", quantity: 8 },
      { itemId: "herbal-tonic", quantity: 6 },
    ],
    reward: {
      gold: 225,
      xp: 140,
      itemId: "training-mark",
      quantity: 8,
      equipmentDropId: "warden-coat",
    },
    version: 1,
  },
] as const satisfies readonly QuestDefinition[];

const questMap = new Map<string, QuestDefinition>(quests.map((quest) => [quest.id, quest]));

export function getQuestDefinition(id: string): QuestDefinition | undefined {
  return questMap.get(id);
}

export function getQuestDefinitions(): readonly QuestDefinition[] {
  return quests;
}
