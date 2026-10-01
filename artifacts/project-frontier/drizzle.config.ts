import { defineConfig } from "drizzle-kit";

if (process.env.NODE_ENV === "production" || process.env.FRONTIER_MIGRATION_ENV === "production") {
  throw new Error("Database migrations are disabled in production.");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/database/schema.ts",
  out: "./src/database/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  strict: true,
  verbose: false,
});