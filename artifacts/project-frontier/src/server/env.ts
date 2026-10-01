import "server-only";
import { z } from "zod";
import { GameError } from "../game/errors";

const databaseUrlSchema = z
  .string()
  .url()
  .refine((value) => value.startsWith("postgres://") || value.startsWith("postgresql://"));

const clerkPublishableKeySchema = z.string().regex(/^pk_(test|live)_[A-Za-z0-9_-]+$/);
const clerkSecretKeySchema = z.string().regex(/^sk_(test|live)_[A-Za-z0-9_-]+$/);

const applicationEnvironmentSchema = z.object({
  DATABASE_URL: databaseUrlSchema,
  CLERK_PUBLISHABLE_KEY: clerkPublishableKeySchema,
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