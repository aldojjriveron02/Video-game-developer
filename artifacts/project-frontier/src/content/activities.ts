import type { ActivityDefinition } from "./gathering";
import { getCraftingActivityDefinition } from "./crafting";
import { getGatheringActivityDefinition } from "./gathering";\nimport { getCombatActivityDefinition } from "./combat";

export function getActivityDefinition(id: string): ActivityDefinition | undefined {
  return getGatheringActivityDefinition(id) ?? getCraftingActivityDefinition(id) ?? getCombatActivityDefinition(id);
}
