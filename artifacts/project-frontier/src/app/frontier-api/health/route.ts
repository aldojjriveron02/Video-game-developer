import { NextResponse } from "next/server";
import { getPool } from "../../../database/client";

export async function GET() {
  try {
    await getPool().query("SELECT 1");
    return NextResponse.json(
      { status: "ok", app: "ok", database: "ok" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { status: "degraded", app: "ok", database: "unavailable" },
      { status: 503 },
    );
  }
}