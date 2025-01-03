import type { MiddlewareFn } from "grammy";
import type { MyContext } from "../services/context.service";

export type HearTypeFunction = () => {
  title: string;
  fn: MiddlewareFn<MyContext>;
};
