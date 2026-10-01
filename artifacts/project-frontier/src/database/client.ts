import "server-only";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { getDatabaseUrl } from "../server/env";
import { frontierSchema } from "./schema";

export type FrontierDatabase = NodePgDatabase<typeof frontierSchema>;

let pool: Pool | undefined;
let database: FrontierDatabase | undefined;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: getDatabaseUrl(),
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      application_name: "project-frontier",
    });
  }
  return pool;
}

export function getDatabase(): FrontierDatabase {
  if (!database) {
    database = drizzle(getPool(), { schema: frontierSchema });
  }
  return database;
}