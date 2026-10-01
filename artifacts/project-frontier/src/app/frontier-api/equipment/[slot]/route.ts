import { NextResponse } from "next/server";
import { withApiErrors } from "../../../../server/api-errors";
import { getGameService } from "../../../../server/game-service";
import { requireCurrentPlayer } from "../../../../server/identity";
import { GameError } from "../../../../game/errors";

type Context = { params: Promise<{ slot: string }> };
export async function PUT(request: Request, context: Context) {
  return withApiErrors(async () => {
    const player = await requireCurrentPlayer();
    const { slot } = await context.params;
    let input: unknown;
    try { input = await request.json(); }
    catch { throw new GameError("invalid_request", "A valid JSON equipment request is required."); }
    return NextResponse.json(await getGameService().equipForPlayer(player.id, slot, input));
  });
}

export async function DELETE(_request: Request, context: Context) {
  return withApiErrors(async () => {
    const player = await requireCurrentPlayer();
    const { slot } = await context.params;
    return NextResponse.json(await getGameService().unequipForPlayer(player.id, slot));
  });
}