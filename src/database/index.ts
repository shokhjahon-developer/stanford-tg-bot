import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

import * as schema from "./schemas";

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT!,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  ssl: false,
});

export const db = drizzle(pool, { schema });

export const migrateDatabase = async () => {
  return migrate(db, {
    migrationsFolder: "./migrations",
  });
};
