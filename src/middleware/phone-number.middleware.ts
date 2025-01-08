import { eq } from "drizzle-orm";
import { NextFunction } from "grammy";

import { Student, type StudentType } from "../database/schemas";
import { db } from "../database";
import type { MyContext } from "../bot/services/context.service";
import { createMainMenuKeyboard } from "../bot/services/commands.service";
import { env } from "../utils/config";
import { GetFirstElement } from "../database/helpers";

export const PhoneNumberMiddleware = async (
  ctx: MyContext,
  next: NextFunction
) => {
  const cus = ctx.session.student as StudentType;
  if (cus?.phoneNumber) return next();

  if (ctx.message?.contact?.phone_number) {
    const updateCus = await db
      .update(Student)
      .set({
        phoneNumber: ctx.message.contact.phone_number,
      })
      .where(eq(Student.chatId, `${ctx.chatId}`))
      .returning()
      .then(GetFirstElement);

    ctx.session.student = updateCus;

    let username = ctx.from?.username ? ctx.from?.username : null;
    username = username ? `@${username}` : "N/A";
    await ctx.api.sendMessage(
      env.ADMIN_CHAT_ID2,
      `🌟 <b>Yangi foydalanuvchi:</b>\n\n` +
        `
      👤 <b>Ismi:</b> ${updateCus!.firstName}\n
      👤 <b>Familyasi:</b> ${updateCus!.lastName}\n
      👤 <b>Telegram ismi:</b> ${updateCus!.tg_first_name}\n
      📱 <b>Telefon raqami:</b> +${updateCus!.phoneNumber}\n
      🆔 <b>Chat ID:</b> ${ctx.chatId}\n
      📝 <b>Username:</b> @${username}\n
      `,
      {
        parse_mode: "HTML",
      }
    );
    await ctx.api.sendMessage(
      env.ADMIN_CHAT_ID,
      `🌟 <b>Yangi foydalanuvchi:</b>\n\n` +
        `
      👤 <b>Ismi:</b> ${updateCus!.firstName}\n
      👤 <b>Familyasi:</b> ${updateCus!.lastName}\n
      👤 <b>Telegram ismi:</b> ${updateCus!.tg_first_name}\n
      📱 <b>Telefon raqami:</b> +${updateCus!.phoneNumber}\n
      📝 <b>Username:</b> @${username}\n
      `,
      {
        parse_mode: "HTML",
      }
    );
    return await ctx.reply(
      "Telefon raqamingizni ulashganingiz uchun raxmat! \nEndi botdan bemalol foydalansangiz bo'ladi✅",
      {
        reply_markup: createMainMenuKeyboard(),
      }
    );
  }

  if (!cus?.phoneNumber) {
    await ctx.reply("Iltimoz telefon raqamingizni yuboring! 📲", {
      reply_markup: {
        keyboard: [
          [{ text: "Telefon raqamni ulashish 📱", request_contact: true }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
    return;
  }
  return next();
};
