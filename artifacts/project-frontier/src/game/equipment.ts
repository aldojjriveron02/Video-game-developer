import { z } from "zod";
import { GameError } from "./errors";
import type { EquipmentDefinition, EquipmentSlot, ResourceDefinition } from "../content/items";
import type { Dashboard } from "./contracts";
import type { Progression } from "./progression";

export const equipmentSlotSchema = z.enum(["hand", "body", "head"]);
export const equipCommandSchema = z.object({ instanceId: z.string().uuid() }).strict();
export type EquipmentRecord = {
  id: string; itemId: string; equippedSlot: EquipmentSlot | null; acquiredAt: string;
};
export type InventoryState = {
  player: Dashboard["player"];
  resources: { itemId: string; quantity: number }[];
  equipment: EquipmentRecord[];
};
export type InventoryView = {
  player: Dashboard["player"];
  progression: Progression;
  resources: { item: ResourceDefinition; quantity: number }[];
  equipment: {
    id: string; item: EquipmentDefinition; equippedSlot: EquipmentSlot | null; acquiredAt: string;
  }[];
  slots: { slot: EquipmentSlot; label: string; equipmentId: string | null }[];
};

export function parseEquipmentSlot(input: unknown): EquipmentSlot {
  const parsed = equipmentSlotSchema.safeParse(input);
  if (!parsed.success) throw new GameError("invalid_request", "The equipment slot is invalid.");
  return parsed.data;
}
export function parseEquipCommand(input: unknown): { instanceId: string } {
  const parsed = equipCommandSchema.safeParse(input);
  if (!parsed.success) throw new GameError("invalid_request", "A valid equipment instance ID is required.");
  return parsed.data;
}