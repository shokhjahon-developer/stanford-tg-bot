import type { Conversation } from "@grammyjs/conversations";
import type { MyContext } from "./context.service";

import { desc, eq, gte } from "drizzle-orm";

import { createMainMenuKeyboard } from "./commands.service";
import { InlineKeyboard } from "grammy";
import { db } from "../../database";
import { Student } from "../../database/schemas";

export type MyConversation = Conversation<MyContext>;

export async function waitForValidName(
  conversation: MyConversation,
  ctx: MyContext
): Promise<string> {
  while (true) {
    const { message } = await conversation.wait();

    if (message?.text) {
      const isValidName =
        /^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u.test(message.text) &&
        message.text.length >= 3 &&
        !/(.)\1{2,}/.test(message.text);

      if (!message.text.startsWith("/") && isValidName) {
        return message.text.trim();
      } else {
        await ctx.reply("Iltimos, ismingizni to'g'ri kiriting! 📝");
      }
    }
  }
}

export function getSessionKey(ctx: MyContext): string | undefined {
  if (ctx.from) {
    return `${ctx.from.id}`;
  }

  return undefined;
}

export async function sendQuestion(
  ctx: MyContext,
  question: any,
  currentIndex: number
) {
  const keyboard = new InlineKeyboard();

  // Add options as inline buttons
  question.options.forEach((option: any, index: any) => {
    keyboard.text(option, `answer_${currentIndex}_${index}`);
  });

  await ctx.reply(
    `Question ${currentIndex}:\n\n${question.question}\n\nChoose an option:`,
    { reply_markup: keyboard }
  );
}

export const sendCourseRegistration = async (
  ctx: MyContext,
  language: string
) => {
  const customer = await db
    .select()
    .from(Student)
    .where(eq(Student.chatId, `${ctx.chatId}`));

  let username = customer[0].username;
  username = username ? `@${username}` : "N/A";

  await ctx.api.sendMessage(
    process.env.ADMIN_CHAT_ID as string,
    `🌟 <b>Yangi kursga yozilmoqchi bo'lgan foydalanuvchi:</b>\n\n` +
      `📚 <b>Qiziqish:</b> ${language} \n\n` +
      `👤 <b>Foydalanuvchi haqida ma'lumotlar:</b>\n\n` +
      `📝 <b>Ism:</b> ${customer[0].firstName}\n` +
      `📝 <b>Familya:</b> ${customer[0].lastName}\n` +
      `📱 <b>Telefon raqami:</b> +${customer[0].phoneNumber}\n` +
      `💬 <b>Telegram username:</b> ${username}\n` +
      `📅 <b>Sanasi:</b> ${new Date().toLocaleDateString()}\n\n` +
      `🚀  <i><b>Iltimos foydalanuvchiga iloji boricha tezroq javob bering! </b></i>`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Telegram orqali bog'lanish",
              url: `https://t.me/${customer[0].username}`,
            },
          ],
        ],
      },
    }
  );
  await ctx.api.sendMessage(
    process.env.DATABASE_ID as string,
    `🌟 <b>Yangi kursga yozilmoqchi bo'lgan foydalanuvchi:</b>\n\n` +
      `📚 <b>Qiziqish:</b> ${language} \n\n` +
      `👤 <b>Foydalanuvchi haqida ma'lumotlar:</b>\n\n` +
      `📝 <b>Ism:</b> ${customer[0].firstName}\n` +
      `📝 <b>Familya:</b> ${customer[0].lastName}\n` +
      `📱 <b>Telefon raqami:</b> +${customer[0].phoneNumber}\n` +
      `💬 <b>Telegram username:</b> ${username}\n` +
      `📅 <b>Sanasi:</b> ${new Date().toLocaleDateString()}\n\n` +
      `🚀  <i><b>Iltimos foydalanuvchiga iloji boricha tezroq javob bering! </b></i>`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Telegram orqali bog'lanish",
              url: `https://t.me/${customer[0].username}`,
            },
          ],
        ],
      },
    }
  );

  return await ctx.reply(
    "🎉 <b>Tabriklaymiz! Siz tanlagan kursga bir qadam yaqinroqsiz! ✅</b>\n\n" +
      "📚 <i>Bizning jamoamiz sizga eng yaxshi ta'lim imkoniyatlarini taqdim etish uchun tez orada bog'lanadi.</i> 📞\n\n" +
      "✨ <b>Kelajagingizni bugundan boshlang!</b>\n\n" +
      "⏳ <i>Tez orada qo'ng'iroq yoki xabar kuting. Biz sizga o'z maqsadlaringizga erishishda yordam beramiz!</i> 🚀\n\n" +
      "📞 <b>Agar darhol bog'lanishni istasangiz:</b>\n" +
      "📱 Qo'ng'iroq qiling: <a href='tel:+998932453539'>+998932453539</a>\n" +
      "📩 Telgramdan xabar qoldiring: <a href='https://t.me/An_Nur_edu_admin'>@An_Nur_edu_admin</a>\n\n" +
      "🙏 <b><i>Bizni tanlaganingiz uchun tashakkur! ☺️</i></b>",
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Kurs haqida batafsil ma'lumot 📖",
              callback_data: "course_details",
            },
            { text: "Bog'lanish 📞", callback_data: "contact_support" },
          ],
          [{ text: "Asosiy menyuga qaytish ⬅️", callback_data: "main_menu" }],
        ],
        ...createMainMenuKeyboard(),
      },
    }
  );
};

const ITEMS_PER_PAGE = 10;

export async function sendLeaderboard(ctx: MyContext, page = 1) {
  const offset = (page - 1) * ITEMS_PER_PAGE;

  // Fetch scores for the current page
  const leaderboard = await db
    .select({
      username: Student.username,
      score: Student.score,
      firstName: Student.firstName,
    })
    .from(Student)
    .orderBy(desc(Student.score))
    .offset(offset)
    .where(gte(Student.score, 0))
    .limit(ITEMS_PER_PAGE);

  // Get the total count of students with scores
  const totalStudents = await db.$count(Student);
  const totalPages = Math.ceil(totalStudents / ITEMS_PER_PAGE);

  // Build leaderboard message
  let message = "<b>🏆 Eng yaxshi ishtirokchilar ro'yxati:</b>\n\n";
  leaderboard.forEach((student, index) => {
    const user = student.username
      ? `<a href="https://t.me/${student.username}">${student.firstName}</a>`
      : `<b>${student.firstName}</b>`;
    const medal =
      index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🏅";
    message += `${medal} <b>${offset + index + 1}.</b> ${user} — <b>${
      student.score
    } ball</b>\n`;
  });

  // Inline keyboard for pagination
  const inlineKeyboard = [];
  if (page > 1) {
    inlineKeyboard.push({
      text: "⬅️ Oldingi",
      callback_data: `leaderboard_page_${page - 1}`,
    });
  }
  if (page < totalPages) {
    inlineKeyboard.push({
      text: "Keyingi ➡️",
      callback_data: `leaderboard_page_${page + 1}`,
    });
  }

  // Send or edit the message
  if (ctx.callbackQuery?.data) {
    await ctx.editMessageText(message, {
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: [inlineKeyboard] },
    });
  } else {
    await ctx.reply(message, {
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: [inlineKeyboard] },
    });
  }
}
