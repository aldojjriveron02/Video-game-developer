import "server-only";
import { NextResponse } from "next/server";
import { GameError } from "../game/errors";

export function apiErrorResponse(error: unknown): NextResponse {
  if (error instanceof GameError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.status },
    );
  }
  if (error instanceof SyntaxError) {
    return NextResponse.json(
      { error: "The request body must be valid JSON.", code: "invalid_request" },
      { status: 400 },
    );
  }
  return NextResponse.json(
    { error: "The request could not be completed.", code: "internal_error" },
    { status: 500 },
  );
}

export async function withApiErrors(
  handler: () => Promise<NextResponse>,
): Promise<NextResponse> {
  try {
    return await handler();
  } catch (error) {
    return apiErrorResponse(error);
  }
}