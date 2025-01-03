import type { HearTypeFunction } from "../hears/types";
import { createMainMenuKeyboard } from "../services/commands.service";

export const startCommand: HearTypeFunction = () => {
  return {
    title: "start",
    fn: async (ctx) => {
      if (!ctx.session.student?.phoneNumber) {
        return await ctx.conversation.enter("greeting");
      }
      await ctx.reply("Assalomu alaykum, Xush kelibsiz! 😊", {
        reply_markup: createMainMenuKeyboard(),
      });
    },
  };
};
