import { NextFunction } from "grammy";
import { eq } from "drizzle-orm";

import { db } from "../database";
import { Student } from "../database/schemas";
import type { MyContext } from "../bot/services/context.service";

export const RegisterCustomer = async (ctx: MyContext, next: NextFunction) => {
  if (ctx.session?.student) return next();

  const chatId = ctx.chat?.id;

  let cs = await db
    .select()
    .from(Student)
    .where(eq(Student.chatId, `${chatId}`));

  if (cs.length === 0) {
    const newStudent = await db
      .insert(Student)
      .values({
        chatId: `${chatId}`,
        phoneNumber: null,
        username: ctx.from?.username,
        firstName: ctx.from?.first_name,
        score: 0,
        lastName: ctx.from?.last_name,
        tg_first_name: ctx.from?.first_name,
      })
      .returning();

    ctx.session.student = newStudent[0];
  } else {
    ctx.session.student = cs[0];
  }

  return next();
};
