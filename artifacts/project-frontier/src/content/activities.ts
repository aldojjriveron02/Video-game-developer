import type { ActivityDefinition } from "./gathering";
import { getCraftingActivityDefinition } from "./crafting";
import { getGatheringActivityDefinition } from "./gathering";
import { getCombatActivityDefinition } from "./combat";
import { getEncounterActivityDefinition } from "./encounters";
import { getQuestDefinition } from "./quests";

export function getActivityDefinition(id: string): ActivityDefinition | undefined {
  return getGatheringActivityDefinition(id) ?? getCraftingActivityDefinition(id) ?? getCombatActivityDefinition(id) ?? getEncounterActivityDefinition(id) ?? getQuestDefinition(id);
}
