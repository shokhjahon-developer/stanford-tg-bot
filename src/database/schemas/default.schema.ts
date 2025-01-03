import { timestamp } from "drizzle-orm/pg-core";

export const DefaultSchema = {
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
};
