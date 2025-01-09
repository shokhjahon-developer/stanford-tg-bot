import { eq } from "drizzle-orm";
import { db } from "../../database";
import { Student } from "../../database/schemas";
import type { MyContext } from "../services/context.service";
import type { HearTypeFunction } from "./types";

export const makePayment: HearTypeFunction = () => {
  return {
    title: "💳 O'quv kursiga to'lov qilish 💼",
    fn: async (ctx: MyContext) => {
      const student = await db
        .select()
        .from(Student)
        .where(eq(Student.chatId, `${ctx.chat?.id}`));
      if (!student[0].groupNumber) {
        ctx.session.hasGroupNumber = true;
        return await ctx.reply(
          "Iltimos, o'quv kursiga to'lov qilishdan oldin guruh raqamingizni kiriting. 📝 \n(Masalan: 12)",
          {
            reply_markup: {
              remove_keyboard: true,
            },
          }
        );
      }

      return await ctx.reply(
        "💰 <b>O'quv kursiga to'lov</b>\n\n" +
          "📋 <i>To'lovni amalga oshirish uchun quyidagi raqamga pul o'tkazing:</i>\n\n" +
          "💳 <b>Karta raqami:\n</b> <pre>9860 1701 0711 3772</pre>\n\n" +
          "👤 <b>Ism Familya:</b> <i>Nurmuxammad Isroilov</i>\n\n" +
          "📸 <i>Chekni screenshot qilishni unutmang, bu to'lovni tasdiqlash uchun kerak bo'ladi!</i>\n\n" +
          "✅ <b>To'lovni amalga oshirgandan so'ng, \"To'lov qildim ✅\" tugmasini bosing!</b>",
        {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [
              [
                {
                  text: "💳 To'lov qildim ✅",
                },
              ],
              [
                {
                  text: "Asosiy Menuga qaytish 📋",
                },
              ],
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        }
      );
    },
  };
};

export const getPaymentInfo: HearTypeFunction = () => {
  return {
    title: "💳 To'lov qildim ✅",
    fn: async (ctx: MyContext) => {
      ctx.session.isPaymentMadeProcess = true;
      ctx.session.isBotFeedback = false;
      ctx.session.isFeedback = false;

      return await ctx.reply(
        "To'lovni amalga oshirilganini tasqilash uchun iltimos chekni yuboring. 📝",
        {
          reply_markup: {
            remove_keyboard: true,
          },
        }
      );
    },
  };
};
