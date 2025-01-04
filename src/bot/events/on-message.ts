import { adminId2, adminId } from "../../app";
import { db } from "../../database";
import { Student } from "../../database/schemas";
import type { MyContext } from "../services/context.service";

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
      await ctx.reply(
        "Photo, Video, Audio and Documents are not supported yet! \n\n If you need to send it pls contact the developer: @shokhjahon_s"
      );
      return (ctx.session.isFeedback = false);
    }
    await ctx.api.sendMessage(
      adminId2,
      `<b>📩 Sizga yangi habar keldi:</b>\n ${message.text}\n\n\n` +
        `name: ${ctx.from!.first_name}\n` +
        `username: ${ctx.from!.username}`,
      {
        parse_mode: "HTML",
      }
    );
    await ctx.api.sendMessage(
      adminId,
      `<b>📩 Sizga yangi habar keldi:</b>\n\n ${message.text}`,
      {
        parse_mode: "HTML",
      }
    );
    await ctx.reply("✅ Arizangiz adminga yetkazildi, Raxmat! 😊");
    return (ctx.session.isFeedback = false);
  } else if (ctx.session.isBotFeedback) {
    if (!message.text) {
      await ctx.reply(
        "Photo, Video, Audio and Documents are not supported yet! \n\n If you need to send it pls contact the developer: @shokhjahon_s"
      );
      return (ctx.session.isBotFeedback = false);
    }
    await ctx.api.sendMessage(
      process.env.BOT_ADMIN_ID!,
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
  }
};
