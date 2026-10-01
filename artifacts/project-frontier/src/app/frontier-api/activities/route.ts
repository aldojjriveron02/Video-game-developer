import { NextResponse } from "next/server";
import { withApiErrors } from "../../../server/api-errors";
import { getGameService } from "../../../server/game-service";
import { requireCurrentPlayer } from "../../../server/identity";

export async function POST(request: Request) {
  return withApiErrors(async () => {
    const player = await requireCurrentPlayer();
    const input: unknown = await request.json();
    const activity = await getGameService().startActivity(player.id, input);
    return NextResponse.json({ activity }, { status: 201 });
  });
}