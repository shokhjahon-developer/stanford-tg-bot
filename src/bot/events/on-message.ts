import { eq } from "drizzle-orm";
import { adminId2, adminId } from "../../app";
import { db } from "../../database";
import { Student } from "../../database/schemas";
import type { MyContext } from "../services/context.service";
import { createMainMenuKeyboard } from "../services/commands.service";
import { env } from "../../utils/config";

export const onMessage = async (ctx: MyContext) => {
  const message = ctx.message!;
  if (ctx.session.isSendingAd) {
    const users = await db.select().from(Student);
    if (message.text) {
      for (const user of users) {
        await ctx.api.sendMessage(user.chatId!, message.text);
      }
    } else if (message.photo) {
      for (const user of users) {
        await ctx.api.sendPhoto(user.chatId!, message.photo[2].file_id, {
          caption: message.caption,
        });
      }
    } else if (message.video) {
      for (const user of users) {
        await ctx.api.sendVideo(user.chatId!, message.video.file_id, {
          caption: message.caption,
        });
      }
    } else {
      return await ctx.reply(
        "Unsupported type, please contact developer: @shokhjahon_s"
      );
    }

    ctx.session.isSendingAd = false;
    return await ctx.reply("Xabar hamma foydalanuvchiga yuborildi! ✅");
  } else if (ctx.session.isFeedback) {
    if (!message.text) {
      return await ctx.reply(
        "Photo, Video, Audio and Documents are not supported yet! \n\n If you need to send it pls contact the developer: @shokhjahon_s"
      );
    }
    await ctx.api.sendMessage(
      adminId2,
      `<b>📩 Sizga yangi habar keldi:</b>\n ${message.text}\n\n\n` +
        `name: ${ctx.from!.first_name}\n` +
        `username: ${ctx.from!.username}`,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Javob yozish",
                callback_data: `reply_feedback: ${ctx.from?.id}`,
              },
            ],
          ],
        },
      }
    );
    await ctx.api.sendMessage(
      adminId,
      `<b>📩 Sizga yangi habar keldi:</b>\n\n ${message.text}`,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Javob yozish",
                callback_data: `reply_feedback: ${ctx.from?.id}`,
              },
            ],
          ],
        },
      }
    );
    await ctx.reply(
      "✅ Arizangiz adminga yetkazildi. \nTez orada sizga bot orqali javob yozishadi.  Raxmat! 😊"
    );
    return (ctx.session.isFeedback = false);
  } else if (ctx.session.isBotFeedback) {
    if (!message.text) {
      await ctx.reply(
        "Photo, Video, Audio and Documents are not supported yet! \n\n If you need to send it pls contact the developer: @shokhjahon_s"
      );
      return (ctx.session.isBotFeedback = false);
    }
    await ctx.api.sendMessage(
      env.ADMIN_CHAT_ID,
      `<b>📩 Botga yangi habar keldi:</b>\n\n ${message.text}\n\n\n` +
        `name: ${ctx.from!.first_name}\n` +
        `username: ${ctx.from?.username}\n` +
        `chatId: ${ctx.chatId}`,
      {
        parse_mode: "HTML",
      }
    );

    await ctx.reply("✅ Arizangiz yetkazildi, Raxmat! 😊");
    return (ctx.session.isBotFeedback = false);
  } else if (ctx.session.isPaymentMadeProcess) {
    if (message.photo) {
      const student = await db
        .select()
        .from(Student)
        .where(eq(Student.chatId, `${ctx.from?.id}`));

      await ctx.api.sendPhoto(adminId2, message.photo[2].file_id, {
        caption:
          `📸 <b>Yangi to'lov keldi:</b>\n\n` +
          `O'quvchi to'liq ma'lumotlari:\n\n` +
          `📝 <b>Ism:</b> ${student[0].firstName}\n` +
          `📝 <b>Familya:</b> ${student[0].lastName}\n` +
          `📝<b>Gruh raqami:</b> +${student[0].groupNumber}\n` +
          `📱 <b>Telefon raqami:</b> +${student[0].phoneNumber}\n` +
          `💬 <b>Telegram username:</b> @${student[0]?.username} \n\n` +
          `\n🚀 <i>To'lovni tasdiqlash yoki bekor qilish uchun quyidagi tugmalardan birini bosing:</i>
        `,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "✅ Tasdiqlash",
                callback_data: `confirm_payment: ${ctx.from?.id}`,
              },
              {
                text: "❌ Bekor qilish",
                callback_data: `cancel_payment: ${ctx.from?.id}`,
              },
            ],
          ],
        },
      });

      await ctx.api.sendPhoto(adminId, message.photo[2].file_id, {
        caption:
          `📸 <b>Yangi to'lov keldi:</b>\n\n` +
          `O'quvchi to'liq ma'lumotlari:\n\n` +
          `📝 <b>Ism:</b> ${student[0].firstName}\n` +
          `📝 <b>Familya:</b> ${student[0].lastName}\n` +
          `📝<b>Gruh raqami:</b> ${student[0].groupNumber}\n` +
          `📱 <b>Telefon raqami:</b> +${student[0].phoneNumber}\n` +
          `💬 <b>Telegram username:</b> ${student[0].username}\n\n` +
          `🚀 <i>To'lovni tasdiqlash yoki bekor qilish uchun quyidagi tugmalardan birini bosing:</i>
        `,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "✅ Tasdiqlash",
                callback_data: `confirm_payment: ${ctx.from?.id}`,
              },
              {
                text: "❌ Bekor qilish",
                callback_data: `cancel_payment ${ctx.from?.id}`,
              },
            ],
          ],
        },
      });
      ctx.session.isPaymentMadeProcess = false;

      return await ctx.reply(
        "To'lov tasdiqlash uchun adminga yuborildi! ✅ \n\n Tez orada to'lovingiz haqida javob keladi! 🚀",
        {
          reply_markup: createMainMenuKeyboard(),
        }
      );
    }
    return await ctx.reply("Iltimos chek rasmini yuboring! 📸");
  } else if (ctx.session.hasGroupNumber) {
    if (message.text) {
      const isNumber = /^\d+$/.test(message.text);

      if (!isNumber) {
        return await ctx.reply("Iltimos, faqat raqam kiriting. Masalan: 12");
      }
      await db
        .update(Student)
        .set({ groupNumber: message.text })
        .where(eq(Student.chatId, `${ctx.chat?.id}`));
      ctx.session.hasGroupNumber = true;
      return await ctx.reply(
        "💰 <b>O'quv kursiga to'lov</b>\n\n" +
          "📋 <i>To'lovni amalga oshirish uchun quyidagi raqamga pul o'tkazing:</i>\n\n" +
          "💳 <b>Karta raqami:\n</b> <pre>9860 1701 0711 3772</pre>\n\n" +
          "👤 <b>Ism Familya:</b> <i>Nurmuxammad Isroilov</i>\n\n" +
          "📸 <i>Chekni screenshot qilishni unutmang, bu to'lovni tasdiqlash uchun kerak bo'ladi!</i>\n\n" +
          "✅ <b>To'lovni amalga oshirgandan so'ng, \"To'lov qildim ✅\" tugmasini bosing!</b>",
        {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [
              [
                {
                  text: "💳 To'lov qildim ✅",
                },
              ],
              [
                {
                  text: "Asosiy Menuga qaytish 📋",
                },
              ],
            ],
          },
        }
      );
    }
    return await ctx.reply(
      "Iltimos, o'quv kursiga to'lov qilishdan oldin guruh raqamingizni kiriting. 📝 \n(Masalan: 12)",
      {
        reply_markup: {
          remove_keyboard: true,
        },
      }
    );
  } else if (ctx.session.replyingToFeedback) {
    const userId = ctx.session.replyingToFeedback;

    if (userId === `${ctx.from!.id}`) {
      await ctx.reply("❌ Siz o'zingizga javob yuborolmaysiz.");
      ctx.session.replyingToFeedback = null;
      return;
    }

    const text = `✉️ <b>Sizga javob keldi:</b>\n\n${message.text}`;
    try {
      await ctx.api.sendMessage(userId, text, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🔄 Javob berish",
                callback_data: `reply_feedback:${ctx.from!.id}`,
              },
            ],
          ],
        },
      });

      const adminText = `${text}\n\n\n   <b>✉️ Javob yuboruvchi ismi:</b> ${
        ctx.from!.first_name
      }\n
   <b>✉️ Javob yuboruvchi username:</b> ${ctx.from!.username}\n
   <b>✉️ Javob yuboruvchi chatId:</b> ${ctx.from!.id}\n
      `;
      await ctx.api.sendMessage(adminId2, adminText, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🔄 Javob berish",
                callback_data: `reply_feedback:${ctx.from!.id}`,
              },
            ],
          ],
        },
      });

      await ctx.reply("✅ Xabar yuborildi.");
    } catch (error) {
      console.error("Failed to send message:", error);
      await ctx.reply("❌ Xabar yuborishda xatolik yuz berdi.");
    }

    ctx.session.replyingToFeedback = null;
    return;
  }
};
