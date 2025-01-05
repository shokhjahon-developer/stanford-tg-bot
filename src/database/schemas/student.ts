import {
  pgTable,
  uuid,
  varchar,
  unique,
  index,
  integer,
} from "drizzle-orm/pg-core";

import { DefaultSchema } from "./default.schema";

export const Student = pgTable(
  "students",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    username: varchar("username"),
    chatId: varchar("chat_id"),
    phoneNumber: varchar("phone_number"),
    firstName: varchar("first_name"),
    lastName: varchar("last_name"),
    groupNumber: varchar("group_number"),
    tg_first_name: varchar("tg_first_name"),
    one_time_score: integer("one_time_score"),
    score: integer("score"),
    ...DefaultSchema,
  },
  (table) => {
    return {
      student_unique: unique().on(table.chatId),
      student_index: index().on(table.chatId),
    };
  }
);

export type StudentType = typeof Student.$inferSelect;
