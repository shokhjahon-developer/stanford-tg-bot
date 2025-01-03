import { eq } from "drizzle-orm";

import type { MyContext } from "./context.service";
import { waitForValidName, type MyConversation } from "./bot.service";
import { db } from "../../database";
import { Student } from "../../database/schemas";

export async function greeting(conversation: MyConversation, ctx: MyContext) {
  if (!ctx.session.student?.phoneNumber) {
    await ctx.replyWithPhoto(
      "AgACAgIAAxkDAAMCZ3FRXMDjyYDeW2MLyvNIhIOrlOUAAnL1MRsuFJFLe_9vxD3vt54BAAMCAAN4AAM2BA",
      {
        caption:
          `🌟 Assalomu alaykum, ${ctx.from?.first_name}! 👋\n\n` +
          `📚 Stanford O'quv Markazining rasmiy botiga xush kelibsiz! 🎓\n\n` +
          `🚀 Bu yerda siz:\n\n` +
          `- 📖 Yangi bilimlarni ortirishingiz,\n` +
          `- ✅ Testlardan muvaffaqiyatli o‘tishingiz,\n` +
          `- 📰 So‘nggi yangiliklardan xabardor bo‘lishingiz mumkin.\n\n` +
          `🔔 Boshlash uchun, iltimos, ro‘yxatdan o‘ting! 📋`,
      }
    );

    await ctx.reply("Iltimos, ismingizni kiriting! 📝");

    let firstName = await waitForValidName(conversation, ctx);

    await ctx.reply("Endi familiyangizni kiriting! 📝");

    let lastName = await waitForValidName(conversation, ctx);

    const updateCus = await db
      .update(Student)
      .set({
        firstName: firstName,
        lastName: lastName,
      })
      .where(eq(Student.chatId, ctx.session.student?.chatId!))
      .returning();

    ctx.session.student = updateCus[0];

    const name = `${firstName} ${lastName}`;

    await ctx.reply(`${name}, iltimos telefon raqamingizni yuboring! 📲`, {
      reply_markup: {
        keyboard: [
          [{ text: "Telefon raqamni ulashish 📱", request_contact: true }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  }
}
