import { NextResponse } from "next/server";
import { withApiErrors } from "../../../server/api-errors";
import { getGameService } from "../../../server/game-service";
import { requireCurrentPlayer } from "../../../server/identity";

export async function GET() {
  return withApiErrors(async () => {
    const player = await requireCurrentPlayer();
    const quests = await getGameService().questsForPlayer(player.id);
    return NextResponse.json(quests);
  });
}
