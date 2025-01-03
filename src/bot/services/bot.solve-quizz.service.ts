import { eq } from "drizzle-orm";

import type { MyContext } from "./context.service";
import { activeTimers, userScores } from "../../app";
import { Question, Student } from "../../database/schemas";
import { db } from "../../database";

let QUESTION_TIME_LIMIT = 15000;

export async function sendQuestionWithTimer(
  ctx: MyContext,
  question: any,
  questionIndex: number
) {
  const chatId = ctx.chat?.id;

  // Ensure chatId is defined
  if (!chatId) return;

  // Set time limit for the question
  QUESTION_TIME_LIMIT = question.time!;

  // Prepare answer options
  const options = question.options.map((option: any, index: number) => [
    {
      text: option,
      callback_data: `answer_${questionIndex}_${index}`,
    },
  ]);

  // Send question to the user
  const questionMessage = await ctx.reply(
    `❓ <b>${questionIndex}-savol:</b> ${question.question}\n\n` +
      `⏱️ <b>Vaqtingiz:</b> ${QUESTION_TIME_LIMIT} soniya.\n` +
      `🎁 <b>Ball:</b> ${question.points}.\n` +
      `👇 <b>Variantlardan birini tanlang:</b>`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: options,
      },
    }
  );

  // Clear any existing timer to prevent overlaps
  if (activeTimers.has(chatId)) {
    clearTimeout(activeTimers.get(chatId));
  }

  // Set new timer
  const timer = setTimeout(async () => {
    try {
      // Delete the question message
      await ctx.api.deleteMessage(ctx.from?.id!, questionMessage.message_id);
    } catch (err: any) {
      console.error(
        `Failed to delete message for chat ${chatId}:`,
        err.message
      );
    }

    // Notify user about timeout
    await ctx.reply(
      `⏳ <b>${questionIndex}-savol uchun vaqt tugadi!</b>\n` +
        `➡️ Keyingi savolga o'tamiz...`,
      {
        parse_mode: "HTML",
      }
    );

    // Load next question
    const nextQuestions = await db
      .select()
      .from(Question)
      .limit(1)
      .offset(questionIndex);

    if (nextQuestions.length > 0) {
      // Proceed to next question
      sendQuestionWithTimer(ctx, nextQuestions[0], questionIndex + 1);
    } else {
      // Calculate and save final score
      const totalCorrect = userScores.get(chatId) || 0;
      userScores.delete(chatId);

      await db
        .update(Student)
        .set({
          one_time_score: totalCorrect,
        })
        .where(eq(Student.chatId, `${chatId}`)); // Avoid template strings

      // Notify user about test completion
      await ctx.reply(
        `🎉 <b>Test yakunlandi!</b>\n\n` +
          `✅ <b>Sizning yig'gan balingiz:</b> ${totalCorrect}`,
        {
          parse_mode: "HTML",
        }
      );
    }

    // Remove timer from activeTimers
    activeTimers.delete(chatId);
  }, QUESTION_TIME_LIMIT * 1000);

  // Save the new timer
  activeTimers.set(chatId, timer);
}
