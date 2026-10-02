import type { Progression } from "./progression";

export type CombatRoundView = {
  round: number;
  playerDamage: number;
  enemyDamage: number;
  playerHpAfter: number;
  enemyHpAfter: number;
};

export type CombatResolutionView = {
  result: "victory" | "defeat";
  enemyId: string;
  enemyName: string;
  playerMaxHp: number;
  enemyMaxHp: number;
  playerHp: number;
  enemyHp: number;
  rounds: CombatRoundView[];
  combatRating: number;
  gearBonuses: {
    strength: number;
    defense: number;
    dexterity: number;
    agility: number;
    vitality: number;
    tactics: number;
  };
};

export type Reward = {
  gold: number;
  xp: number;
  itemId: string;
  quantity: number;
  skillId?: string;
  skillXp?: number;
  combat?: CombatResolutionView;
  equipmentDropId?: string;
};

export type ResourceCost = {
  itemId: string;
  quantity: number;
};

export type SkillView = Progression & {
  id: string;
  name: string;
  category: "combat" | "gathering" | "production";
  description: string;
};

export type ActivityView = {
  id: string;
  definitionId: string;
  status: "active" | "claimed" | "cancelled";
  startedAt: string;
  finishesAt: string;
  claimedAt: string | null;
  cancelledAt: string | null;
  reward: Reward;
  inputs: ResourceCost[];
};

export type ActivityDurationOptionView = {
  id: string;
  label: string;
  durationSeconds: number;
  reward: Reward;
  inputs: ResourceCost[];
};

export type ActivityDefinitionView = {
  id: string;
  name: string;
  description: string;
  durationSeconds: number;
  reward: Reward;
  inputs: ResourceCost[];
  durationOptions: ActivityDurationOptionView[];
};

export type ActivityResponse = { activity: ActivityView };

export type ClaimResponse = {
  activity: ActivityView;
  ledger: { id: string; activityId: string; kind: string; reward: Reward; createdAt: string };
  rewardGranted: boolean;
  levelsGained: number;
  progression: Progression;
  skillLevelsGained: number;
  skillProgression: { skillId: string; progression: Progression } | null;
};

export type Dashboard = {
  serverTime: string;
  progression: Progression;
  skills: SkillView[];
  player: { id: string; displayName: string; gold: number; xp: number; createdAt: string };
  activeActivity: ActivityView | null;
  recentActivities: ActivityView[];
  inventory: { itemId: string; quantity: number }[];
  ledger: { id: string; activityId: string; kind: string; reward: Reward; createdAt: string }[];
  gathering: ActivityDefinitionView;
  gatheringActivities: ActivityDefinitionView[];
};

export type SkillsResponse = {
  player: Dashboard["player"];
  skills: SkillView[];
};

export type CraftingRecipeView = ActivityDefinitionView & {
  skillId: string;
};

export type CraftingResponse = {
  serverTime: string;
  player: Dashboard["player"];
  activeActivity: ActivityView | null;
  activeActivityName: string | null;
  inventory: { itemId: string; quantity: number }[];
  recipes: CraftingRecipeView[];
};


export type CombatDrillView = ActivityDefinitionView & {
  skillId: string;
};

export type CombatEnemyView = {
  id: string;
  encounterId: string;
  name: string;
  description: string;
  regionId: string;
  regionName: string;
  requiredCombatRating: number;
  maxHp: number;
  attack: number;
  defense: number;
  reward: Reward;
  equipmentDrop?: { itemId: string; chance: number };
};

export type CombatResponse = {
  serverTime: string;
  player: Dashboard["player"];
  activeActivity: ActivityView | null;
  activeActivityName: string | null;
  drills: CombatDrillView[];
  enemies: CombatEnemyView[];
  combatRating: number;
  gearBonuses: {
    strength: number;
    defense: number;
    dexterity: number;
    agility: number;
    vitality: number;
    tactics: number;
  };
};


export type QuestStatus = "locked" | "available" | "active" | "completed";

export type QuestView = {
  id: string;
  name: string;
  description: string;
  objective: string;
  regionName: string;
  status: QuestStatus;
  inputs: ResourceCost[];
  reward: Reward;
  hasInputs: boolean;
  requiredQuestId?: string;
};

export type QuestsResponse = {
  serverTime: string;
  player: Dashboard["player"];
  activeActivity: ActivityView | null;
  activeActivityName: string | null;
  quests: QuestView[];
};
