export type ClerkKeyKind = "pk" | "sk";

export const PROJECT_FRONTIER_CLERK_DEV_PUBLISHABLE_KEY =
  "pk_test_aGVscGZ1bC1wdW1hLTc4NzMuY2xlcmsuYWNjb3VudHMuZGV2JA==";

export function extractClerkKey(
  value: string | undefined,
  kind: ClerkKeyKind,
): string | undefined {
  if (!value) return undefined;

  const trimmed = value.trim();
  const prefixes = [`${kind}_test_`, `${kind}_live_`];

  let start = -1;
  for (const prefix of prefixes) {
    const index = trimmed.indexOf(prefix);
    if (index >= 0 && (start < 0 || index < start)) {
      start = index;
    }
  }

  if (start < 0) return trimmed;

  return trimmed
    .slice(start)
    .split(/\s/, 1)[0]
    ?.replace(/["';,]+$/, "");
}

export function clerkKeyMode(
  value: string | undefined,
  kind: ClerkKeyKind,
): "test" | "live" | "missing" | "unknown" {
  const key = extractClerkKey(value, kind);
  if (!key) return "missing";
  if (key.startsWith(`${kind}_test_`)) return "test";
  if (key.startsWith(`${kind}_live_`)) return "live";
  return "unknown";
}

export function getEffectivePublishableKey(
  value: string | undefined,
): { key: string; usedFallback: boolean } {
  const extracted = extractClerkKey(value, "pk");
  const mode = clerkKeyMode(extracted, "pk");

  if (mode === "test" || mode === "live") {
    return { key: extracted!, usedFallback: false };
  }

  return {
    key: PROJECT_FRONTIER_CLERK_DEV_PUBLISHABLE_KEY,
    usedFallback: true,
  };
}
