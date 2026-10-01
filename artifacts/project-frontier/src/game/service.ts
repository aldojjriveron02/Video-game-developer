import type { Dashboard, Reward } from "./contracts";
import { getActivityDefinition, getGatheringDefinition } from "../content/gathering";
import { startActivityCommandSchema, type StartActivityCommand } from "./commands";
import { GameError } from "./errors";

export type Player = {
  id: string;
  displayName: string;
  gold: number;
  xp: number;
  createdAt: Date;
};

export type ActivityRecord = {
  id: string;
  definitionId: string;
  status: "active" | "claimed";
  startedAt: Date;
  finishesAt: Date;
  claimedAt: Date | null;
  reward: Reward;
};

export type LedgerRecord = {
  id: string;
  activityId: string;
  kind: string;
  reward: Reward;
  createdAt: Date;
};

export type ClaimedActivity = {
  activity: ActivityRecord;
  ledger: LedgerRecord;
};

export interface GameRepository {
  resolveClerkIdentity(clerkUserId: string, displayName: string): Promise<Player>;
  getDashboard(playerId: string): Promise<Omit<Dashboard, "gathering">>;
  startActivity(playerId: string, command: StartActivityCommand): Promise<ActivityRecord>;
  claimActivity(playerId: string, activityId: string): Promise<ClaimedActivity>;
}

export function parseStartActivityCommand(input: unknown): StartActivityCommand {
  const parsed = startActivityCommandSchema.safeParse(input);
  if (!parsed.success) {
    throw new GameError("invalid_request", "The activity request is invalid.");
  }
  return parsed.data;
}

export class GameService {
  constructor(private readonly repository: GameRepository) {}

  repositoryForIdentity(clerkUserId: string, displayName: string): Promise<Player> {
    return this.repository.resolveClerkIdentity(clerkUserId, displayName);
  }

  async dashboardForPlayer(playerId: string): Promise<Dashboard> {
    const dashboard = await this.repository.getDashboard(playerId);
    const definition = getGatheringDefinition();
    return {
      ...dashboard,
      gathering: {
        id: definition.id,
        name: definition.name,
        description: definition.description,
        durationSeconds: definition.durationSeconds,
        reward: { ...definition.reward },
      },
    };
  }

  async startActivity(playerId: string, input: unknown): Promise<ActivityRecord> {
    const command = parseStartActivityCommand(input);
    const definition = getActivityDefinition(command.definitionId);
    if (!definition) {
      throw new GameError("invalid_request", "The requested activity is not available.");
    }
    return this.repository.startActivity(playerId, command);
  }

  async claimActivity(playerId: string, activityId: string): Promise<ClaimedActivity> {
    return this.repository.claimActivity(playerId, activityId);
  }
}