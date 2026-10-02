export const EQUIPMENT_SLOTS = [
  { id: "hand", label: "Hand" },
  { id: "body", label: "Body" },
  { id: "head", label: "Head" },
] as const;
export type EquipmentSlot = (typeof EQUIPMENT_SLOTS)[number]["id"];

export type ResourceDefinition = {
  id: string; name: string; description: string; kind: "resource";
};
export type CombatBonuses = {
  strength?: number;
  defense?: number;
  dexterity?: number;
  agility?: number;
  vitality?: number;
  tactics?: number;
};

export type EquipmentDefinition = {
  id: string; name: string; description: string; kind: "equipment";
  slot: EquipmentSlot; rarity: "common" | "uncommon" | "rare";
  combatBonuses: CombatBonuses;
};
export type ItemDefinition = ResourceDefinition | EquipmentDefinition;

const definitions: readonly ItemDefinition[] = [
  { id: "wood", name: "Wood", kind: "resource", description: "Timber collected from the nearby forest." },
  { id: "stone", name: "Stone", kind: "resource", description: "Usable stone broken from shallow frontier deposits." },
  { id: "river-fish", name: "River Fish", kind: "resource", description: "Fresh fish caught from regional waters." },
  { id: "hide", name: "Hide", kind: "resource", description: "A basic animal hide gathered while hunting." },
  { id: "medicinal-herb", name: "Medicinal Herb", kind: "resource", description: "A common plant used by future alchemy and medicine systems." },
  { id: "wild-berries", name: "Wild Berries", kind: "resource", description: "Edible berries gathered while foraging." },
  { id: "iron-ore", name: "Iron Ore", kind: "resource", description: "Raw iron-bearing ore extracted from frontier deposits." },
  { id: "plant-fiber", name: "Plant Fiber", kind: "resource", description: "Tough natural fibers gathered for textile work." },
  { id: "lumber", name: "Lumber", kind: "resource", description: "Processed timber used by carpentry and construction." },
  { id: "iron-ingot", name: "Iron Ingot", kind: "resource", description: "Refined iron stock ready for future blacksmithing recipes." },
  { id: "cloth", name: "Cloth", kind: "resource", description: "Woven frontier cloth ready for future tailoring recipes." },
  { id: "cooked-fish", name: "Cooked Fish", kind: "resource", description: "Prepared river fish ready for travel or later food systems." },
  { id: "leather", name: "Leather", kind: "resource", description: "Tanned hide ready for leatherworking recipes." },
  { id: "herbal-tonic", name: "Herbal Tonic", kind: "resource", description: "A basic alchemical tonic prepared from frontier plants." },
  { id: "training-mark", name: "Training Mark", kind: "resource", description: "A stamped record earned from completed combat training sessions." },
  { id: "field-axe", name: "Field Axe", kind: "equipment", slot: "hand", rarity: "common",
    combatBonuses: { strength: 1 },
    description: "A basic station-issued axe. Its weight gives a small Strength bonus in combat." },
  { id: "work-vest", name: "Work Vest", kind: "equipment", slot: "body", rarity: "common",
    combatBonuses: { vitality: 1 },
    description: "A sturdy station-issued vest that provides a small Vitality bonus in combat." },
  { id: "wolf-fang-knife", name: "Wolf Fang Knife", kind: "equipment", slot: "hand", rarity: "uncommon",
    combatBonuses: { dexterity: 2, agility: 1 },
    description: "A light frontier blade fashioned around a ridge-wolf fang. Improves Dexterity and Agility." },
  { id: "boar-hide-coat", name: "Boar Hide Coat", kind: "equipment", slot: "body", rarity: "uncommon",
    combatBonuses: { defense: 2, vitality: 2 },
    description: "Heavy cured hide from an ashback boar. Improves Defense and Vitality." },
  { id: "scout-hood", name: "Scout Hood", kind: "equipment", slot: "head", rarity: "rare",
    combatBonuses: { tactics: 2, agility: 2 },
    description: "Recovered bandit field gear built for awareness and movement. Improves Tactics and Agility." },
  { id: "bandit-saber", name: "Bandit Saber", kind: "equipment", slot: "hand", rarity: "rare",
    combatBonuses: { strength: 2, dexterity: 2 },
    description: "A balanced raider blade recovered from the Rust Trail. Improves Strength and Dexterity." },
  { id: "quarry-helm", name: "Quarry Helm", kind: "equipment", slot: "head", rarity: "uncommon",
    combatBonuses: { defense: 2, tactics: 1 },
    description: "A reinforced work helm scavenged from the Old Quarry. Improves Defense and Tactics." },
  { id: "warden-coat", name: "Warden Coat", kind: "equipment", slot: "body", rarity: "rare",
    combatBonuses: { defense: 3, vitality: 3, tactics: 1 },
    description: "Heavy frontier armor once worn by an outpost warden. Strongly improves survivability." },
];

export const STARTER_EQUIPMENT = ["field-axe", "work-vest"] as const;
export function getItemDefinition(id: string): ItemDefinition | undefined {
  return definitions.find((item) => item.id === id);
}

export function combatBonusesForEquipment(itemIds: readonly string[]): Required<CombatBonuses> {
  const total: Required<CombatBonuses> = {
    strength: 0,
    defense: 0,
    dexterity: 0,
    agility: 0,
    vitality: 0,
    tactics: 0,
  };
  for (const itemId of itemIds) {
    const item = getItemDefinition(itemId);
    if (!item || item.kind !== "equipment") continue;
    for (const key of Object.keys(total) as (keyof CombatBonuses)[]) {
      total[key] += item.combatBonuses[key] ?? 0;
    }
  }
  return total;
}