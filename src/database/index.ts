import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

import * as schema from "./schemas";
import { env } from "../utils/config";

const pool = new Pool({
  host: env.DATABASE_HOST,
  port: +env.DATABASE_PORT,
  database: env.DATABASE_NAME,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASS,
  ssl: false,
});

export const db = drizzle(pool, { schema });

export const migrateDatabase = async () => {
  return migrate(db, {
    migrationsFolder: "./migrations",
  });
};
