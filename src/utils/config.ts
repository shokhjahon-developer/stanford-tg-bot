import zennv from "zennv";
import { z } from "zod";

export const env = zennv({
  dotenv: true,
  schema: z.object({
    BOT_TOKEN: z.string(),
    CHANNEL_ID: z.string(),
    ADMIN_CHAT_ID: z.string(),
    BOT_ADMIN_ID: z.string(),
    ADMIN_CHAT_ID2: z.string(),
    DATABASE_PASS: z.string(),
    DATABASE_NAME: z.string(),
    DATABASE_USER: z.string(),
    DATABASE_PORT: z.string(),
    DATABASE_HOST: z.string(),
  }),
});
