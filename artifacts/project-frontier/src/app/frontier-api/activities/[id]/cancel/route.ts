import { NextResponse } from "next/server";
import { z } from "zod";
import { withApiErrors } from "../../../../../server/api-errors";
import { getGameService } from "../../../../../server/game-service";
import { requireCurrentPlayer } from "../../../../../server/identity";
import { GameError } from "../../../../../game/errors";

const activityIdSchema = z.string().uuid();

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return withApiErrors(async () => {
    const player = await requireCurrentPlayer();
    const { id } = await context.params;
    const parsedId = activityIdSchema.safeParse(id);
    if (!parsedId.success) {
      throw new GameError("invalid_request", "The activity identifier is invalid.");
    }
    const activity = await getGameService().cancelActivity(player.id, parsedId.data);
    return NextResponse.json({ activity });
  });
}
