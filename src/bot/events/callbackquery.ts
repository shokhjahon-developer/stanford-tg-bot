import {
  sendLeaderboard,
  sendCourseRegistration,
} from "../services/bot.service";
import {
  courseInfoRu,
  courseInfoKo,
  courseInfoEn,
  createMainMenuKeyboard,
  createAdminMainMenuKeyboard,
} from "../services/commands.service";
import type { MyContext } from "../services/context.service";

export const callbackQuery = async (ctx: MyContext) => {
  const data = ctx.callbackQuery!.data;

  if (!data) return;

  if (data.startsWith("leaderboard_page_")) {
    const page = parseInt(data.split("_").pop() || "0", 10);
    await sendLeaderboard(ctx, page);
  }
  if (data.startsWith("confirm_payment")) {
    let user = data.split(":")[1].trim();
    console.log("user", user, "user");

    await ctx.deleteMessage();
    await ctx.api.sendMessage(
      user,
      "Sizning to'lovingiz qabul qilindi! ✅ \nTo'lovni amalga oshirganingiz uchun raxmat!😊",
      {
        reply_markup: createMainMenuKeyboard(),
      }
    );
    return await ctx.reply(
      "O'quvchiga to'lovi qabul qilingani haqida xabar yuborildi! ✅",
      {
        reply_markup: createAdminMainMenuKeyboard(),
      }
    );
  }
  if (data.startsWith("reply_feedback")) {
    let userId = data.split(":")[1].trim();
    await ctx.reply("📝 Xabaringizni yozing: ");
    return (ctx.session.replyingToFeedback = userId);
  }
  if (data.startsWith("cancel_payment")) {
    let user = data.split(" ")[1].trim();
    console.log("user", user, "user");

    await ctx.deleteMessage();
    await ctx.api.sendMessage(
      user,
      "Kechirasiz, sizning to'lovingiz qabul qilinmadi! ❌ \nQayta urinib ko'ring yoki biz bilan bog'laning!",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📞 Biz bilan bog'lanish",
                callback_data: "call_support",
              },
            ],
          ],
        },
      }
    );
    return await ctx.reply(
      "O'quvchiga to'lovi qabul qilinmaganini xabar yuborildi! ❌",
      {
        reply_markup: createAdminMainMenuKeyboard(),
      }
    );
  }
  if (data === "academy_photos") {
    await ctx.deleteMessage();
    const sentMsg = await ctx.reply("Iltimos biroz kuting...⌛️");
    await ctx.replyWithMediaGroup([
      {
        type: "video",
        media:
          "BAACAgIAAxkDAAP8Z3FzyC_FQZBCcvn8bTf7FwgktE0AAnloAAIuFJFLsJ8McjyheHw2BA",
      },
      {
        type: "video",
        media:
          "BAACAgIAAxkDAAP9Z3F0kpHs3e_CgIf7rJFqItAoKrAAAoRoAAIuFJFLr775rtX_8O42BA",
      },
      {
        type: "video",
        media:
          "BAACAgIAAxkDAAP-Z3F1g24lar8D_mCP3VgJid1l0lEAAopoAAIuFJFLyoAGkub3dlM2BA",
      },

      {
        type: "photo",
        media:
          "AgACAgIAAxUHZ3FRsDvJWkR5tGek27kbwwABsqdAAAJ89TEbLhSRSwws6cbFiv5HAQADAgADeQADNgQ",
      },
      {
        type: "photo",
        media:
          "AgACAgIAAxUHZ3FRsP2GcvxkA6uPe8WkXEJkQoEAAnf1MRsuFJFLC2FH4o2kjq0BAAMCAAN5AAM2BA",
      },
      {
        type: "photo",
        media:
          "AgACAgIAAxUHZ3FRsF_CLZwTaIAqBGdOCOG452MAAnj1MRsuFJFLGKKD3h5CvxEBAAMCAAN5AAM2BA",
      },
      {
        type: "photo",
        media:
          "AgACAgIAAxUHZ3FRsBxDoqMB7Q40Jeg5qAtNEgkAAnr1MRsuFJFLYU0VqN0HaDMBAAMCAAN5AAM2BA",
      },
      {
        type: "photo",
        media:
          "AgACAgIAAxUHZ3FRsCeMx-lui1lwvXz4lhHylz8AAnv1MRsuFJFL4uiZiqnNOVcBAAMCAAN5AAM2BA",
      },
      {
        type: "photo",
        media:
          "AgACAgIAAxUHZ3FRsEJIv0KFNpvfJST_XoNJAVcAAnb1MRsuFJFLpQWJtW8YKXYBAAMCAAN5AAM2BA",
      },
      {
        type: "photo",
        media:
          "AgACAgIAAxUHZ3FRsBFl3YvsjEU4CMfZVu8Iv0sAAnn1MRsuFJFLc8Jzm2Uph8kBAAMCAAN5AAM2BA",
      },
    ]);

    await ctx.api.deleteMessage(sentMsg.chat.id, sentMsg.message_id);
    return await ctx.reply(
      "📸 <b>Tepadagi rasmlar bizning O'quv markazimizdagi bilim va muvaffaqiyatga to'la muhitni namoyish etadi!</b> 🎓\n\n" +
        "<b>Sizning kelajagingiz aynan shu yerdan boshlanadi!</b> 🌟\n\n" +
        "<b>Tashrif buyuring, hamma sharoitlarimizni o'zingiz ko'ring va orzularingiz sari ilk qadamni qo'ying.</b> 💪\n\n",
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📞 Biz bilan bog'lanish",
                callback_data: "call_support",
              },
            ],
          ],
        },
      }
    );
  }
  if (data === "location") {
    await ctx.deleteMessage();
    await ctx.replyWithLocation(41.157753864000156, 69.11588138659266);
    return await ctx.reply(
      "📍 Bizning O'quv markazimizga bemalol tashrif buyurishingiz mumkin. Sizni kutib olishdan mamnun bo'lamiz! 🤝",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📞 Biz bilan bog'lanish",
                callback_data: "call_support",
              },
            ],
          ],
        },
      }
    );
  }
  if (data === "call_support") {
    await ctx.deleteMessage();
    await ctx.reply(
      "📞 <b>Biz bilan bog'laning!</b> 🌟\n\n" +
        "💼 <i>Savollaringiz bormi? Biz har doim yordamga tayyormiz!</i> 🤝\n\n" +
        "☎️ <b>Telefon orqali bog'lanish:</b>\n" +
        "📲 <a href='tel:+998932453539'><b>+998932453539</b></a>\n\n" +
        "💬 <b>Telegram orqali yozing:</b>\n" +
        "✈️ <a href='https://t.me/An_Nur_edu_admin'><b>@An_Nur_edu_admin</b></a>\n\n" +
        "📌 <i>Agar bog'lana olmasangiz, iltimos birozdan so'ng qayta urinib ko'ring yoki Telegram orqali yozing!</i> ✉️",
      {
        parse_mode: "HTML",
      }
    );
  }
  if (data === "bot_feedback") {
    await ctx.deleteMessage();
    await ctx.reply(
      "<b>Bu xatolikni befarq qoldirmang!</b>\n\nBizga xabar bering:\n📞 <i>Telefon:</i> <a href='tel:+998932453539'>+998932453539</a>",
      { parse_mode: "HTML" }
    );
  }
  if (data === "register_english") {
    await ctx.deleteMessage();
    await sendCourseRegistration(ctx, "Ingliz tili 🇬🇧");
  } else if (data === "register_russian") {
    await ctx.deleteMessage();
    await sendCourseRegistration(ctx, "Rus tili 🇷🇺");
  } else if (data === "register_korean") {
    await ctx.deleteMessage();
    await sendCourseRegistration(ctx, "Koreys tili 🇰🇷");
  } else if (data === "next_course_ru") {
    await ctx.editMessageMedia(
      {
        type: "photo",
        media:
          "AgACAgIAAxkDAAMpZ3FSLMdvRUg4sqOXrJuO5C3Hb-AAAoD1MRsuFJFLrTyf3xG7uTkBAAMCAAN4AAM2BA",
        caption: courseInfoRu,
        parse_mode: "HTML",
      },
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "⏪",
                callback_data: "next_course_english",
              },
              {
                text: "⏩",
                callback_data: "next_course_korean",
              },
            ],

            [
              {
                text: "📝 Bir bosishda ro'yxatdan o'tish 🚀",
                callback_data: "register_russian",
              },
            ],
          ],
        },
      }
    );
  } else if (data === "next_course_korean") {
    await ctx.editMessageMedia(
      {
        type: "photo",
        media:
          "AgACAgIAAxkDAAMqZ3FSMqh7UW9QgBxMDG8MwY-8MgsAAoH1MRsuFJFLUik4pW6UBj8BAAMCAAN5AAM2BA",
        caption: courseInfoKo,
        parse_mode: "HTML",
      },
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "⏪",
                callback_data: "next_course_english",
              },
            ],
            [
              {
                text: "📝 Bir bosishda ro'yxatdan o'tish 🚀",
                callback_data: "register_korean",
              },
            ],
          ],
        },
      }
    );
  } else if (data === "next_course_english") {
    await ctx.editMessageMedia(
      {
        type: "photo",
        media:
          "AgACAgIAAxkDAAMoZ3FSJ5DfwdOu1ik9gaDl0NKKTRIAAn_1MRsuFJFLM5SsL8xbq9QBAAMCAAN4AAM2BA",
        caption: courseInfoEn,
        parse_mode: "HTML",
      },
      {
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
      }
    );
  }
};
