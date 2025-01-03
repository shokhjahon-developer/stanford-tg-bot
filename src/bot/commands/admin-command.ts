import { adminId, adminId2 } from "../../app";
import type { MyContext } from "../services/context.service";
import type { HearTypeFunction } from "../hears/types";
import { createAdminMainMenuKeyboard } from "../services/commands.service";

export const adminCommand: HearTypeFunction = () => {
  return {
    title: "admin",
    fn: async (ctx: MyContext) => {
      if (ctx.from?.id !== adminId && ctx.from?.id !== adminId2) {
        return await ctx.reply("Permission denied!!! 🚫");
      }
      await ctx.reply("Admin planelga xush kelibsiz! ✅", {
        reply_markup: createAdminMainMenuKeyboard(),
      });
    },
  };
};
