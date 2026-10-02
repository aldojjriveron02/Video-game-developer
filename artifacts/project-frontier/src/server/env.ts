import "server-only";
import { z } from "zod";
import { GameError } from "../game/errors";
import {
  extractClerkKey,
  getEffectivePublishableKey,
} from "./auth/clerk-keys";

const databaseUrlSchema = z
  .string()
  .trim()
  .url()
  .refine((value) => value.startsWith("postgres://") || value.startsWith("postgresql://"));

const clerkPublishableKeySchema = z.preprocess(
  (value) =>
    getEffectivePublishableKey(
      typeof value === "string" ? value : undefined,
    ).key,
  z.string().regex(/^pk_(test|live)_.+$/),
);

const clerkSecretKeySchema = z.preprocess(
  (value) => extractClerkKey(typeof value === "string" ? value : undefined, "sk"),
  z.string().regex(/^sk_(test|live)_.+$/),
);

const applicationEnvironmentSchema = z.object({
  DATABASE_URL: databaseUrlSchema,
  CLERK_PUBLISHABLE_KEY: clerkPublishableKeySchema.optional(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: clerkPublishableKeySchema.optional(),
  CLERK_SECRET_KEY: clerkSecretKeySchema,
});

export type ApplicationEnvironment = z.infer<typeof applicationEnvironmentSchema>;

export function getApplicationEnvironment(): ApplicationEnvironment {
  const result = applicationEnvironmentSchema.safeParse(process.env);
  if (!result.success) {
    throw new GameError(
      "configuration_error",
      "Server configuration is incomplete or invalid. Check DATABASE_URL and Clerk keys.",
    );
  }
  return result.data;
}

export function getDatabaseUrl(): string {
  const result = databaseUrlSchema.safeParse(process.env.DATABASE_URL);
  if (!result.success) {
    throw new GameError(
      "configuration_error",
      "Server database configuration is incomplete or invalid.",
    );
  }
  return result.data;
}
