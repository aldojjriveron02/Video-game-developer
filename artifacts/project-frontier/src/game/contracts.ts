import type { Progression } from "./progression";

export type Reward = { gold: number; xp: number; itemId: string; quantity: number };
export type ActivityView = {
  id: string; definitionId: string; status: "active" | "claimed";
  startedAt: string; finishesAt: string; claimedAt: string | null;
  reward: Reward;
};
export type ActivityResponse = { activity: ActivityView };
export type ClaimResponse = {
  activity: ActivityView;
  ledger: { id: string; activityId: string; kind: string; reward: Reward; createdAt: string };
  rewardGranted: boolean;
  levelsGained: number;
  progression: Progression;
};
export type Dashboard = {
  serverTime: string;
  progression: Progression;
  player: { id: string; displayName: string; gold: number; xp: number; createdAt: string };
  activeActivity: ActivityView | null;
  recentActivities: ActivityView[];
  inventory: { itemId: string; quantity: number }[];
  ledger: { id: string; activityId: string; kind: string; reward: Reward; createdAt: string }[];
  gathering: { id: string; name: string; description: string; durationSeconds: number; reward: Reward };
};