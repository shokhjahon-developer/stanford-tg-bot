import { title } from "process";
import { sendCourseRegistration } from "../services/bot.service";
import { courseInfoEn } from "../services/commands.service";
import type { MyContext } from "../services/context.service";
import type { HearTypeFunction } from "./types";

export const getCourses: HearTypeFunction = () => {
  return {
    title: "📚 Kurslar 🔥",
    fn: async (ctx: MyContext) => {
      await ctx.replyWithPhoto(
        "AgACAgIAAxkDAAMoZ3FSJ5DfwdOu1ik9gaDl0NKKTRIAAn_1MRsuFJFLM5SsL8xbq9QBAAMCAAN4AAM2BA",
        {
          caption: courseInfoEn,
          reply_markup: {
            inline_keyboard: [
              [{ text: "⏩", callback_data: "next_course_ru" }],
              [
                {
                  text: "📝 Bir bosishda ro'yxatdan o'tish 🚀",
                  callback_data: "register_english",
                },
              ],
            ],
          },
          parse_mode: "HTML",
        }
      );
    },
  };
};

export const enrollCourses: HearTypeFunction = () => {
  return {
    title: "✍️ Kursga yozilish 📝",
    fn: async (ctx: MyContext) => {
      return await ctx.reply(
        "🚀 <b>Kelajak sari ilk qadamni qo'ying!</b> 🌟\n\n" +
          "✨ <b>Cheksiz imkoniyatlar olamiga sho'ng'ing!</b> 🌍 Bizning kurslarimiz sizga yangi bilimlar, karyera imkoniyatlari va o'sish sari yo'l ochadi. 📈 \n\n" +
          "🔥 <b>Orzularingizni ro'yobga chiqaring!</b> Bugunoq boshlang va muvaffaqiyat sari qadam tashlang! 💼📚 \n\n" +
          "👇 <b>Quyidagi fanlardan birini tanlang va yangi safaringizni boshlang!</b>",
        {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [
              ["🇬🇧 Ingliz tili 🇬🇧", "🇷🇺 Rus tili 🇷🇺"],
              ["🇰🇷 Koreys tili 🇰🇷"],
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        }
      );
    },
  };
};

export const enrollKr: HearTypeFunction = () => {
  return {
    title: "🇰🇷 Koreys tili 🇰🇷",
    fn: async (ctx: MyContext) => {
      await sendCourseRegistration(ctx, "Koreys tili 🇰🇷");
    },
  };
};
export const enrollEn: HearTypeFunction = () => {
  return {
    title: "🇬🇧 Ingliz tili 🇬🇧",
    fn: async (ctx: MyContext) => {
      await sendCourseRegistration(ctx, "Ingliz tili 🇬🇧");
    },
  };
};
export const enrollRu: HearTypeFunction = () => {
  return {
    title: "🇷🇺 Rus tili 🇷🇺",
    fn: async (ctx: MyContext) => {
      await sendCourseRegistration(ctx, "Rus tili 🇷🇺");
    },
  };
};
