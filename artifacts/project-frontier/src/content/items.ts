export const EQUIPMENT_SLOTS = [
  { id: "hand", label: "Hand" },
  { id: "body", label: "Body" },
  { id: "head", label: "Head" },
] as const;
export type EquipmentSlot = (typeof EQUIPMENT_SLOTS)[number]["id"];

export type ResourceDefinition = {
  id: string; name: string; description: string; kind: "resource";
};
export type EquipmentDefinition = {
  id: string; name: string; description: string; kind: "equipment";
  slot: EquipmentSlot; rarity: "common";
};
export type ItemDefinition = ResourceDefinition | EquipmentDefinition;

const definitions: readonly ItemDefinition[] = [
  { id: "wood", name: "Wood", kind: "resource", description: "Timber collected at the field station. Stored as a persistent resource stack." },
  { id: "field-axe", name: "Field Axe", kind: "equipment", slot: "hand", rarity: "common",
    description: "A basic station-issued axe. Starter hand equipment; it does not change gathering rewards or speed." },
  { id: "work-vest", name: "Work Vest", kind: "equipment", slot: "body", rarity: "common",
    description: "A sturdy station-issued vest. Starter body equipment; no combat or stat effects are enabled." },
];

export const STARTER_EQUIPMENT = ["field-axe", "work-vest"] as const;
export function getItemDefinition(id: string): ItemDefinition | undefined {
  return definitions.find((item) => item.id === id);
}