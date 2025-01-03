import type { Bot } from "grammy";
import type { MyContext } from "../services/context.service";
import * as competetions from "./competetion.hears";
import * as courses from "./courses.hears";
import * as admin from "./admin.hears";
import * as aboutAcademy from "./about-academy.hears";

export const initHears = (bot: Bot<MyContext>) => {
  Object.values(competetions).forEach((item) => {
    const { title, fn } = item();
    bot.hears(title, fn);
  });
  Object.values(courses).forEach((item) => {
    const { title, fn } = item();
    bot.hears(title, fn);
  });
  Object.values(admin).forEach((item) => {
    const { title, fn } = item();
    bot.hears(title, fn);
  });
  Object.values(aboutAcademy).forEach((item) => {
    const { title, fn } = item();
    bot.hears(title, fn);
  });
};
