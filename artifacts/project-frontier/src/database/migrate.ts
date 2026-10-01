import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { z } from "zod";
import { frontierSchema } from "./schema";

const databaseUrlSchema = z
  .string()
  .url()
  .refine((value) => value.startsWith("postgres://") || value.startsWith("postgresql://"));

async function main() {
  if (
    process.env.NODE_ENV === "production" ||
    process.env.FRONTIER_MIGRATION_ENV === "production"
  ) {
    throw new Error("Database migrations are disabled in production.");
  }

  const parsedUrl = databaseUrlSchema.safeParse(process.env.DATABASE_URL);
  if (!parsedUrl.success) {
    throw new Error("DATABASE_URL is required and must be a PostgreSQL URL.");
  }

  const pool = new Pool({ connectionString: parsedUrl.data, application_name: "frontier-migrate" });
  try {
    const database = drizzle(pool, { schema: frontierSchema });
    await migrate(database, { migrationsFolder: `${process.cwd()}/src/database/migrations` });
    console.info("Project Frontier development database migrations applied.");
  } finally {
    await pool.end();
  }
}

main().catch(() => {
  console.error("Project Frontier database migration failed. Check the development DATABASE_URL and migration state.");
  process.exitCode = 1;
});