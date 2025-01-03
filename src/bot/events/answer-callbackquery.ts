import { eq } from "drizzle-orm";
import { activeTimers, bot, userScores } from "../../app";
import { db } from "../../database";
import { Question, Student } from "../../database/schemas";
import { sendLeaderboard } from "../services/bot.service";
import { sendQuestionWithTimer } from "../services/bot.solve-quizz.service";
import type { MyContext } from "../services/context.service";
import type { url } from "inspector";
import type { text } from "stream/consumers";

export const answerCallbackQuery = async (
  ctx: MyContext,
  currentIndex: string,
  optionIndex: string
) => {
  const questionIndex = parseInt(currentIndex, 10);
  const selectedOption = parseInt(optionIndex, 10);

  const chatId = ctx.chat?.id;

  const timer = activeTimers.get(chatId!);
  if (timer) {
    clearTimeout(timer);
    activeTimers.delete(chatId!);
  }

  if (!userScores.has(chatId!)) {
    userScores.set(chatId!, 0);
  }

  const questions = await db
    .select()
    .from(Question)
    .limit(1)
    .offset(questionIndex - 1);

  if (questions.length === 0) {
    return ctx.answerCallbackQuery("Invalid question!");
  }

  const question = questions[0];
  const options = question.options as string[];

  const isCorrect = options[selectedOption] === question.answer;
  if (isCorrect) {
    const currentScore = userScores.get(chatId!) || 0;
    userScores.set(chatId!, currentScore + question.points!);
  }

  await ctx.deleteMessage();
  await ctx.answerCallbackQuery(
    isCorrect ? "✅ Javobingiz To'gri! 🎉" : " ❌ Javobingiz noto'g'ri 😞"
  );
  await ctx.reply(
    "Javobingiz " + (isCorrect ? "to'gri! ✅ 🎉" : "noto'g'ri! ❌😞")
  );

  const nextQuestions = await db
    .select()
    .from(Question)
    .limit(1)
    .offset(questionIndex);

  if (nextQuestions.length > 0) {
    sendQuestionWithTimer(ctx, nextQuestions[0], questionIndex + 1);
  } else {
    const totalCorrect = userScores.get(chatId!) || 0;
    userScores.delete(chatId!);

    await db
      .update(Student)
      .set({
        one_time_score: totalCorrect,
      })
      .where(eq(Student.chatId, `${chatId}`));

    return await ctx.reply(
      `🏆 *Musobaqa yakunlandi!* 🎉\n\n💥 *Siz ajoyib natijalarga erishdingiz!* ✨\n🎯 *Umumiy balingiz:* *${totalCorrect}* 🌟\n\n🔥 *Eslatma:* Yakuniy ballaringiz umumiy reytingga qo'shiladi va eng kuchli *TOP 10* ishtirokchilar ro'yxati kanalimizda e'lon qilinadi! 🏅\n\n📢 *G'oliblar kim ekanini bilishni xohlaysizmi?* 🔍 Kanalimizni kuzatib boring va eng yaxshi natijalar bilan tanishing! 🚀\n\n🎊 *Keyingi musobaqalarda ham ishtirok etib, yana yutuqlarga erishing!* 💪`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🔥 Bizning kanalga o'tish",
                url: "https://t.me/stanfordNGO",
              },
            ],
          ],
        },
      }
    );
  }
};
