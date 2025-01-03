import { Context, SessionFlavor } from "grammy";

import type { ConversationFlavor } from "@grammyjs/conversations";
import type { Student } from "../../database/schemas";

interface SessionData {
  student?: typeof Student.$inferSelect;
  organizationId: string;
  isSendingAd: boolean;
  isFeedback: boolean;
  date: string;
}

export type MyContext = Context &
  SessionFlavor<SessionData> &
  ConversationFlavor;
