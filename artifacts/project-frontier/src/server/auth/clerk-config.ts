import "server-only";
import { publishableKeyFromHost } from "@clerk/shared/keys";

export function getClerkOptions(headers: Headers) {
  const raw = headers.get("x-forwarded-host") ?? headers.get("host") ?? "";
  const hostname = raw.split(",")[0]?.trim().split(":")[0] ?? "";
  const publishableKey = publishableKeyFromHost(hostname, process.env.CLERK_PUBLISHABLE_KEY);
  if (!publishableKey) throw new Error("Authentication configuration is missing.");
  return { publishableKey, proxyUrl: process.env.CLERK_PROXY_URL };
}