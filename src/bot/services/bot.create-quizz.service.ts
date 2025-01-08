import { type MyConversation } from "./bot.service";
import type { MyContext } from "./context.service";
import { createAdminMainMenuKeyboard } from "./commands.service";
import { db } from "../../database";
import { Question, Student } from "../../database/schemas";
import { env } from "../../utils/config";

export async function creatingPollQuizzes(
  conversation: MyConversation,
  ctx: MyContext
) {
  const questionsArray: {
    question: string;
    options: string[];
    answer: string;
    time: number;
    points: number;
  }[] = [];
  await ctx.reply(
    "⏱ Test tugash vaqtini kiriting! (masalan: 10-01-2025 soat 23:59 gachon!)"
  );

  const response = await conversation.wait();
  const date = response.message?.text;

  while (true) {
    let isStopped = false;
    let question: string | undefined;
    let options: string[] | undefined;
    let answer: string | undefined;
    let time: number | undefined;
    let points: number | undefined;

    try {
      do {
        await ctx.reply(
          "📋 *Savolni kiriting!* \n\n📝 Savol matnini yozing yoki testni tugatish uchun *Stop 🛑* tugmasini bosing 👇",
          {
            reply_markup: {
              keyboard: [[{ text: "Stop 🛑" }]],
              one_time_keyboard: true,
              resize_keyboard: true,
            },
            parse_mode: "Markdown",
          }
        );
        const response = await conversation.wait();
        question = response.message?.text;

        if (question?.toLowerCase() === "stop 🛑") {
          isStopped = true;
          break;
        }

        if (questionsArray.some((q) => q.question === question)) {
          await ctx.reply("⚠️ *Bu savol allaqachon kiritilgan!* ❌");
          question = undefined;
        }
      } while (!question);

      if (isStopped) break;

      // Get options
      do {
        await ctx.reply(
          "🔢 *Variantlarni kiriting!* \n\nVariantlarni vergul bilan ajratib yozing (masalan: A, B, C, D).",
          { parse_mode: "Markdown" }
        );
        const response = await conversation.wait();
        if (response.message?.text?.toLowerCase() === "stop 🛑") {
          await ctx.reply(
            "🛑 *Test yaratish to'xtatildi!* \n\nHozirgi kiritilgan savollar saqlandi. ✅",
            {
              reply_markup: createAdminMainMenuKeyboard(),
              parse_mode: "Markdown",
            }
          );
          isStopped = true;
          break;
        }
        options = response.message?.text?.split(",").map((o) => o.trim());

        if (!options || options.length < 2) {
          await ctx.reply("⚠️ *Kamida 2 ta variant kiritishingiz kerak!* ❌");
          options = undefined;
        }
      } while (!options);

      if (isStopped) break;

      // Get correct answer
      do {
        await ctx.reply(
          "✅ *To'g'ri javobni kiriting!* \n\nVariantlardan birini yozing (masalan: B).",
          { parse_mode: "Markdown" }
        );
        const response = await conversation.wait();
        answer = response.message?.text;

        if (answer?.toLowerCase() === "stop 🛑") {
          await ctx.reply(
            "🛑 *Test yaratish to'xtatildi!* \n\nHozirgi kiritilgan savollar saqlandi. ✅",
            {
              reply_markup: createAdminMainMenuKeyboard(),
              parse_mode: "Markdown",
            }
          );
          isStopped = true;
          break;
        }

        if (!answer || !(options && options.includes(answer))) {
          await ctx.reply(
            "⚠️ *To'g'ri javob variantlardan biri bo'lishi kerak!* ❌"
          );
          answer = undefined;
        }
      } while (!answer);

      if (isStopped) break;

      // Get time
      do {
        await ctx.reply(
          "⏱ *Savol uchun vaqtni kiriting!* \n\nSoniyalar ichida yozing (masalan: 30).",
          { parse_mode: "Markdown" }
        );
        const response = await conversation.wait();
        if (response.message?.text?.toLowerCase() === "stop 🛑") {
          await ctx.reply(
            "🛑 *Test yaratish to'xtatildi!* \n\nHozirgi kiritilgan savollar saqlandi. ✅",
            {
              reply_markup: createAdminMainMenuKeyboard(),
              parse_mode: "Markdown",
            }
          );
          isStopped = true;
          break;
        }
        const timeInput = parseInt(response.message?.text || "0", 10);

        if (!isNaN(timeInput) && timeInput > 0) {
          time = timeInput;
        } else {
          await ctx.reply("⚠️ *Iltimos, to'g'ri vaqt kiriting!* ⏳");
        }
      } while (!time);

      if (isStopped) break;

      // Get points
      do {
        await ctx.reply(
          "🏆 *Savol uchun ballni kiriting!* \n\nBallni sonlar bilan yozing (masalan: 10).",
          { parse_mode: "Markdown" }
        );
        const response = await conversation.wait();
        if (response.message?.text?.toLowerCase() === "stop 🛑") {
          await ctx.reply(
            "🛑 *Test yaratish to'xtatildi!* \n\nHozirgi kiritilgan savollar saqlandi. ✅",
            {
              reply_markup: createAdminMainMenuKeyboard(),
              parse_mode: "Markdown",
            }
          );
          isStopped = true;
          break;
        }
        const pointsInput = parseInt(response.message?.text || "0", 10);

        if (!isNaN(pointsInput) && pointsInput > 0) {
          points = pointsInput;
        } else {
          await ctx.reply("⚠️ *Iltimos, to'g'ri ball miqdorini kiriting!* 🏆");
        }
      } while (!points);

      if (isStopped) break;

      // Save question
      questionsArray.push({
        question,
        options: options || [],
        answer,
        time: time!,
        points: points!,
      });

      await ctx.reply(
        `✅ *Savol qo'shildi!* \n\n📋 *Savol:* ${question}\n🔢 *Variantlar:* ${options?.join(
          ", "
        )}\n✅ *To'g'ri javob:* ${answer}\n⏱ *Vaqt:* ${time} soniya\n🏆 *Ball:* ${points}`,
        { parse_mode: "Markdown" }
      );
    } catch (error) {
      await ctx.reply(
        "❌ *Xatolik yuz berdi!* \n\nIltimos, qaytadan urinib ko'ring.",
        { parse_mode: "Markdown" }
      );
      console.error(error);
      break;
    }
  }

  if (questionsArray.length > 0) {
    try {
      await db.insert(Question).values(questionsArray);
      await notifyUsers(ctx, date!);
      await ctx.reply(
        `Test yaratish to'xtatildi! 🛑 \n\n Barcha savollar muvaffaqiyatli saqlandi va hamma foydalanuvchilar xabar berildi ✅ \n\n  📝 Savollar soni: ${questionsArray.length}`,
        {
          reply_markup: createAdminMainMenuKeyboard(),
        }
      );
    } catch (error) {
      await ctx.reply("Xatolik yuz berdi! ❌ Savollarni saqlashda muammo.");
      console.error(error);
    }
  } else {
    await ctx.reply("Hech qanday savol qo'shilmadi! ❌", {
      reply_markup: createAdminMainMenuKeyboard(),
    });
  }
}

export async function notifyUsers(ctx: MyContext, date: string) {
  const students = await db.select().from(Student);

  for (const student of students) {
    await ctx.api.sendMessage(
      `${student.chatId}`,
      `🚀 *Diqqat! Yangi musobaqa boshlandi!* 🎯\n\n🎉 *Bilimingizni sinovdan o'tkazing va g'alaba qozoning!* 🏆\n\n⏳ *Musobaqa yakunlanish vaqti:* 🕰️ *${date}* ⏰\n\n🔥 *Shoshiling! Vaqt sizni kutmaydi — g'oliblar safida bo'ling!* 🚀`,
      { parse_mode: "Markdown" }
    );
  }
  const channelId = env.CHANNEL_ID;
  return ctx.api.sendMessage(
    channelId!,
    `🚀 *Diqqat! Yangi musobaqa boshlandi!* 🎯\n\n🎉 *Bilimingizni sinovdan o'tkazing va g'alaba qozoning!* 🏆\n\n⏳ *Musobaqa yakunlanish vaqti:* 🕰️ *${date}* ⏰\n\n🔥 *Shoshiling! Vaqt sizni kutmaydi — g'oliblar safida bo'ling!* 🚀`,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🚀 Ishtirok etish",
              url: `https://t.me/stanfordNGO_bot`,
            },
          ],
        ],
      },
    }
  );
}
