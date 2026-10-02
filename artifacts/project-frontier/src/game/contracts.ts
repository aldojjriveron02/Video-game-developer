import type { Progression } from "./progression";

export type Reward = {
  gold: number;
  xp: number;
  itemId: string;
  quantity: number;
  skillId?: string;
  skillXp?: number;
};

export type SkillView = Progression & {
  id: string;
  name: string;
  category: "combat" | "gathering" | "production";
  description: string;
};
export type ActivityView = {
  id: string; definitionId: string; status: "active" | "claimed" | "cancelled";
  startedAt: string; finishesAt: string; claimedAt: string | null; cancelledAt: string | null;
  reward: Reward;
};
export type ActivityDefinitionView = {
  id: string;
  name: string;
  description: string;
  durationSeconds: number;
  reward: Reward;
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
