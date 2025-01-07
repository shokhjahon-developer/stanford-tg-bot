import { title } from "process";
import { academyInfo } from "../services/commands.service";
import type { MyContext } from "../services/context.service";
import type { HearTypeFunction } from "./types";

export const aboutAcademy: HearTypeFunction = () => {
  return {
    title: "ℹ️ Biz haqimizda 🏢",
    fn: async (ctx: MyContext) => {
      return await ctx.reply(academyInfo, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🖼 O'quv Markazi 🎥",
                callback_data: "academy_photos",
              },
            ],
            [
              {
                text: "📞 Biz bilan bog'lanish",
                callback_data: "call_support",
              },
            ],
            [{ text: "📍 Lokatsiya", callback_data: "location" }],
          ],
        },
      });
    },
  };
};

export const contactSupport: HearTypeFunction = () => {
  return {
    title: "📞 Biz bilan bog'lanish 📲",
    fn: async (ctx: MyContext) => {
      await ctx.reply("Biz bilan qanday bog'lanishni xohlaysiz?", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📞 Telefon qilish orqali",
                callback_data: "call_support",
              },
            ],

            [
              {
                text: "💬 Telegram orqali",
                url: "https://t.me/shokhjahon_s",
              },
            ],
            [
              {
                text: "📍 O'quv markaziga borish orqali",
                callback_data: "location",
              },
            ],
          ],
        },
      });
    },
  };
};

export const offer: HearTypeFunction = () => {
  return {
    title: "📩  Shikoyat  |  Talab  |  Taklif  🗣️",
    fn: async (ctx: MyContext) => {
      await ctx.reply(
        "<b>✨ Hurmatli foydalanuvchi! ✨</b>\n\n" +
          "<i>Biz sizning fikr-mulohazalaringizni qadrlaymiz!</i>\n" +
          "📬 Iltimos, o'z <b><u>Shikoyat</u>, <u>Talab</u>, yoki <u>Taklif</u></b>ingizni yozib qoldiring. Sizning fikringiz bizning xizmatlarimizni yanada yaxshilashga yordam beradi! 🙌\n\n" +
          "🔒 <b>Bu jarayon 100% anonim.</b> Admin sizning shaxsingizni bilmaydi, shuning uchun fikringizni bemalol bildiring. 💬\n\n" +
          "✅ <b>O'zingizni erkin his qiling!</b> Biz sizning yordam bilan mukammal xizmatlarga erishamiz. 💡\n\n" +
          "<b><i>Rahmat! 😊</i></b>",
        { parse_mode: "HTML" }
      );
      return (ctx.session.isFeedback = true);
    },
  };
}; 

export const offerToBot: HearTypeFunction = () => {
  return {
    title: "🛠️ Botdagi Muammo yoki Taklif 💡",
    fn: async (ctx: MyContext) => {
      ctx.session.isBotFeedback = true;
      return await ctx.reply(
        "⚠️ <b>Botda muammo yoki taklifingiz bormi?</b>\n\n" +
          "<b>Buni bizga aytishdan erinmang, sizning fikringiz biz uchun muhim ‼️</b>\n\n" +
          "📞 <b>Telefon:</b> <a href='tel:+998931203081'>+998931203081</a>\n" +
          "💬 <b>Telegram:</b> <a href='https://t.me/shokhjahon_s'>@shokhjahon_s</a>\n" +
          "📝 <b>Anonim yozish:</b> Shunchaki  o'z fikringizni botda yozib qoldirishingiz mumkin.👇 📝\n\n" +
          "📩 <i>Fikr-mulohazalaringizni yuborish uchun shunchaki xabar yuboring. Sizning ismingiz ko'rinmaydi!</i> 💡\n\n" +
          "📞 <b>Yoki yuqoridagi ma'lumotlar orqali biz bilan bog'lanishingiz mumkin.</b>",
        {
          parse_mode: "HTML",
        }
      );
    },
  };
};
