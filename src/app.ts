import "dotenv/config";
import Redis from "ioredis";
import { Bot, session } from "grammy";
import { limit } from "@grammyjs/ratelimiter";
import { conversations, createConversation } from "@grammyjs/conversations";

import { initHears } from "./bot/hears";
import { commands } from "./bot/commands";
import { migrateDatabase } from "./database";
import { onMessage } from "./bot/events/on-message";
import { callbackQuery } from "./bot/events/callbackquery";
import { greeting } from "./bot/services/bot.greeting.service";
import type { MyContext } from "./bot/services/context.service";
import { RegisterCustomer } from "./middleware/register-student";
import { answerCallbackQuery } from "./bot/events/answer-callbackquery";
import { PhoneNumberMiddleware } from "./middleware/phone-number.middleware";
import { creatingPollQuizzes } from "./bot/services/bot.create-quizz.service";
import { env } from "./utils/config";

const redis = new Redis({
  host: "localhost",
  port: 6379,
});
export const adminId = +env.ADMIN_CHAT_ID;
export const adminId2 = +env.ADMIN_CHAT_ID2;

export const bot = new Bot<MyContext>(env.BOT_TOKEN);

bot.use(
  session({
    initial: () => ({}),
  })
);
bot.use(RegisterCustomer);
bot.use(conversations());
bot.use(createConversation(greeting));
bot.use(createConversation(creatingPollQuizzes));

bot.use(
  limit({
    timeFrame: 1000,
    limit: 3,
    storageClient: redis,
    onLimitExceeded: async (ctx) => {
      await ctx.reply("You sent too many messages! Slow down !!!");

      // const cooldownTime = 5 * 1000;
      const cooldownTime = 60 * 60 * 1000;

      await redis.set(`cooldown:${ctx.from?.id}`, "on", "PX", cooldownTime);
      await redis.set(`cooldown:${ctx.from?.id}`, "on", "PX", cooldownTime);

      return true;
    },
    keyGenerator: (ctx) => {
      return ctx.from?.id.toString();
    },
  })
);
bot.use(async (ctx, next) => {
  const cooldownKey = `cooldown:${ctx.from?.id}`;

  const cooldownStatus = await redis.get(cooldownKey);

  if (cooldownStatus === "on") {
    return ctx.reply("You are on cooldown !!!");
  }

  await next();
});

commands(bot);

bot.use(PhoneNumberMiddleware);

initHears(bot);

export const userScores = new Map<number, number>();
export const activeTimers = new Map<number, NodeJS.Timeout>();

bot.callbackQuery(/answer_(\d+)_(\d+)/, async (ctx) => {
  const [_, currentIndex, optionIndex] = ctx.match;
  await answerCallbackQuery(ctx, currentIndex, optionIndex);
});

bot.on("callback_query:data", async (ctx) => {
  await callbackQuery(ctx);
});

bot.on("message", async (ctx) => {
  await onMessage(ctx);
});

(async function bootstrap() {
  await migrateDatabase();
  bot.start();
  // logger.info("Bot is running");
  console.log("Bot is running");
})();

bot.catch((err) => {
  console.error("Error:", err);
});
