import { adminId, adminId2 } from "../../app";
import { db } from "../../database";
import { Student } from "../../database/schemas";
import type { HearTypeFunction } from "./types";

export const countUsers: HearTypeFunction = () => {
  return {
    title: "👥 Foydalanuvchilar soni",
    fn: async (ctx) => {
      const students = await db.select().from(Student);
      await ctx.reply(`Foydalanuvchilar soni: ${students.length} 👥`);
    },
  };
};

export const sendMessages: HearTypeFunction = () => {
  return {
    title: "✍️ Xabar yuborish 📝",
    fn: async (ctx) => {
      if (ctx.from?.id !== adminId && ctx.from?.id !== adminId2) {
        return await ctx.reply("Permission denied!!! 🚫");
      }
      await ctx.reply(
        "📢 <b>Admin panel:</b>\n\n" +
          "✍️ <i>Iltimos, yubormoqchi bo'lgan xabaringizni kiriting.</i> 📝\n\n" +
          "⚠️ <b>Diqqat:</b> <i>Xabar yuborilishidan oldin xabarni yana bir bor tekshirib ko'ring!</i> ✅",
        {
          parse_mode: "HTML",
        }
      );
      ctx.session.isSendingAd = true;
    },
  };
};
