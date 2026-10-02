import "server-only";
import { getEffectivePublishableKey } from "./clerk-keys";

export function getClerkOptions() {
  const rawPublishableKey =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ??
    process.env.CLERK_PUBLISHABLE_KEY;

  const { key: publishableKey } = getEffectivePublishableKey(rawPublishableKey);
  return { publishableKey };
}
