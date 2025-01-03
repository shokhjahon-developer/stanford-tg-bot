import type { Bot } from "grammy";

import type { MyContext } from "../services/context.service";
import * as admin from "./admin-command";
import * as start from "./start-command";

export const commands = (bot: Bot<MyContext>) => {
  Object.values(admin).forEach((item) => {
    const { title, fn } = item();
    bot.command(title, fn);
  });
  Object.values(start).forEach((item) => {
    const { title, fn } = item();
    bot.command(title, fn);
  });
};
