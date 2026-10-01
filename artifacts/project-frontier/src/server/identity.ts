import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { GameError } from "../game/errors";
import type { Player } from "../game/service";
import { getGameService } from "./game-service";
import { getApplicationEnvironment } from "./env";

export async function requireCurrentPlayer(): Promise<Player> {
  getApplicationEnvironment();
  const { userId } = await auth();
  if (!userId) {
    throw new GameError("unauthorized", "Sign in to access your frontier.");
  }

  const user = await currentUser();
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    user?.username ||
    "Frontier Explorer";

  return getGameService().repositoryForIdentity(userId, displayName);
}