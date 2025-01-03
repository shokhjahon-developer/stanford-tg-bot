import {
  pgTable,
  uuid,
  varchar,
  unique,
  index,
  text,
  integer,
  json,
} from "drizzle-orm/pg-core";

import { DefaultSchema } from "./default.schema";

export const Question = pgTable(
  "questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    question: text("question"),
    options: json("options"),
    answer: varchar("answer"),
    time: integer("time"),
    points: integer("point"),
    ...DefaultSchema,
  },
  (table) => {
    return {
      question_unique: unique().on(table.id),
      question_index: index().on(table.id),
    };
  }
);

export type QuestionType = typeof Question.$inferSelect;
