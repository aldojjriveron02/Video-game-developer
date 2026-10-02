import { NextResponse } from "next/server";
import { createClerkClient } from "@clerk/nextjs/server";
import { getPool } from "../../../database/client";
import {
  clerkKeyMode,
  extractClerkKey,
  getEffectivePublishableKey,
} from "../../../server/auth/clerk-keys";

export async function GET() {
  const revision = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? "local";
  const publishableRaw =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ??
    process.env.CLERK_PUBLISHABLE_KEY;
  const secretRaw = process.env.CLERK_SECRET_KEY;

  const {
    key: effectivePublishableKey,
    usedFallback: usingFallbackPublishableKey,
  } = getEffectivePublishableKey(publishableRaw);
  const secretKey = extractClerkKey(secretRaw, "sk");

  const publishableMode = clerkKeyMode(effectivePublishableKey, "pk");
  const secretMode = clerkKeyMode(secretRaw, "sk");

  let database: "ok" | "unavailable" = "ok";
  let clerkBackend: "ok" | "unavailable" = "ok";
  let clerkInstanceEnvironment: "development" | "production" | "unknown" =
    "unknown";

  try {
    await getPool().query("SELECT 1");
  } catch {
    database = "unavailable";
  }

  try {
    if (!secretKey) throw new Error("missing Clerk secret key");
    const client = createClerkClient({ secretKey });
    const instance = await client.instance.get();
    clerkInstanceEnvironment =
      instance.environmentType === "development"
        ? "development"
        : instance.environmentType === "production"
          ? "production"
          : "unknown";
  } catch {
    clerkBackend = "unavailable";
  }

  const auth = {
    publishableKeyPresent: Boolean(publishableRaw),
    publishableMode,
    usingFallbackPublishableKey,
    secretKeyPresent: Boolean(secretRaw),
    secretMode,
    keyModesMatch:
      publishableMode !== "missing" &&
      secretMode !== "missing" &&
      publishableMode === secretMode,
    clerkBackend,
    clerkInstanceEnvironment,
  };

  const status =
    database === "ok" &&
    auth.keyModesMatch &&
    clerkBackend === "ok" &&
    clerkInstanceEnvironment === "development"
      ? "ok"
      : "degraded";

  return NextResponse.json(
    { status, app: "ok", database, revision, auth },
    { status: status === "ok" ? 200 : 503 },
  );
}
