import { adminId, adminId2 } from "../../app";
import { db } from "../../database";
import { Question, Student } from "../../database/schemas";
import type { MyContext } from "../services/context.service";
import type { HearTypeFunction } from "./types";
import { desc, eq, gte } from "drizzle-orm";
import { sendQuestionWithTimer } from "../services/bot.solve-quizz.service";
import { sendLeaderboard } from "../services/bot.service";
import { env } from "../../utils/config";

export const CreateCompetition: HearTypeFunction = () => {
  return {
    title: "📝 Musobaqa yaratish 🏆",
    fn: async (ctx: MyContext) => {
      if (ctx.from?.id !== +adminId && ctx.from?.id !== +adminId2) {
        return await ctx.reply("Permission denied!!! 🚫");
      }
      const questions = await db.select().from(Question);
      if (questions.length) {
        return await ctx.reply(
          "Musobaqa davom etmoqda ‼️  \n Yangi musobaqa yaratish uchun iltimos hozirgi musobaqani yakunlang! 🏁"
        );
      }
      return await ctx.conversation.enter("creatingPollQuizzes");
    },
  };
};

export const finishCompetition: HearTypeFunction = () => {
  return {
    title: "🏁 Musobaqani yakunlash 🏁",
    fn: async (ctx: MyContext) => {
      if (ctx.from?.id !== +adminId && ctx.from?.id !== +adminId2) {
        return await ctx.reply("Permission denied!!! 🚫");
      }
      const questions = await db.select().from(Question);
      if (questions.length === 0) {
        return await ctx.reply("Musobaqa mavjud emas! 😕");
      }

      const top10Scores = await db
        .select({
          username: Student.username,
          score: Student.one_time_score,
          firstName: Student.firstName,
        })
        .from(Student)
        .orderBy(desc(Student.one_time_score))
        .where(gte(Student.one_time_score, 0))
        .limit(10);

      if (top10Scores.length === 0) {
        return await ctx.reply("Hozirda reyting mavjud emas! 😕");
      }

      let message =
        "<b> Musobaqa yakunlandi 🏁</b> \n\n🏆 <b>Eng yaxshi Top 10 ishtirokchi ro'yxati:</b>\n\n";
      top10Scores.forEach((student, index) => {
        const user = student.username
          ? `<a href="https://t.me/${student.username}">${student.firstName}</a>`
          : `<b>${student.firstName}</b>`;
        const medal =
          index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🏅";
        message += `${medal} <b>${index + 1}.</b> ${user} — <b>${
          student.score
        } ball</b>\n`;
      });

      const channelId = env.CHANNEL_ID;
      await ctx.api.sendMessage(channelId!, message, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📊 Botga Kirish",
                url: `https://t.me/stanfordNGO_bot`,
              },
            ],
          ],
        },
      });

      const students = await db
        .select()
        .from(Student)
        .where(gte(Student.score, 0));
      for (const student of students) {
        const studentScore = student.score! + student.one_time_score!;

        await db
          .update(Student)
          .set({
            one_time_score: null,
            score: studentScore,
          })
          .where(eq(Student.chatId, `${student.chatId}`));
      }
      await db.delete(Question);

      return await ctx.reply(
        "Musobaqa yakunlandi 🏁 \n\nTop 10 ishtirokchi ma'lumotlari kanalga yuborildi! ✅",
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "📊 Kanalda ko'rish",
                  url: `https://t.me/stanfordNGO`,
                },
              ],
            ],
          },
        }
      );
    },
  };
};

export const cancelCompetition: HearTypeFunction = () => {
  return {
    title: "🚫 Musobaqani bekor qilish 🚫",
    fn: async (ctx: MyContext) => {
      if (ctx.from?.id !== +adminId && ctx.from?.id !== +adminId2) {
        return await ctx.reply("Permission denied!!! 🚫");
      }
      const questions = await db.select().from(Question);
      if (!questions.length) {
        return await ctx.reply("Musobaqa mavjud emas! 😕");
      }
      await db.delete(Question);
      return await ctx.reply("Musobaqa bekor qilindi ❌");
    },
  };
};

export const participateCompetition: HearTypeFunction = () => {
  return {
    title: "📝 Musobaqada qatnashish 🏆",
    fn: async (ctx: MyContext) => {
      const questions = await db.select().from(Question).limit(1);
      if (questions.length === 0) {
        return ctx.reply(
          "🏆 <b>Hozirda musobaqa mavjud emas! 🚫</b>\n\n" +
            "⏳ <i>Yangi musobaqalar haqida tez orada ma'lumot beramiz. Bizni kuzatishda davom eting!</i> 🌟",
          {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "📣 Kanalni kuzatish",
                    url: "https://t.me/stanfordNGO",
                  },
                ],
              ],
            },
          }
        );
      }

      const hasParticipated = await db
        .select()
        .from(Student)
        .where(eq(Student.chatId, `${ctx.chat?.id}`));

      if (hasParticipated[0].one_time_score !== null) {
        return ctx.reply(
          `🎉 <b>Siz allaqachon musobaqada ishtirok etgansiz!</b>\n\n` +
            `📊 <b>Sizning natijangiz:</b> <i>${hasParticipated[0].one_time_score}</i> 🏆\n\n` +
            `🏅 <b>Musobaqa tugagach, o'rinlar e'lon qilinadi.</b>\n\n` +
            `📬 <b>Yangiliklar va natijalar haqida xabardor bo'lish uchun:</b>\n` +
            `👀 <b>Quyidagi kanalni kuzatib boring!</b> 🔔`,
          {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "📣 Kanalni kuzatish",
                    url: "https://t.me/stanfordNGO",
                  },
                ],
              ],
            },
          }
        );
      }

      const question = questions[0];
      sendQuestionWithTimer(ctx, question, 1);
    },
  };
};

export const leaderboard: HearTypeFunction = () => {
  return {
    title: "🌟 Leaderboard 📊",
    fn: async (ctx: MyContext) => {
      await sendLeaderboard(ctx, 1);
    },
  };
};
