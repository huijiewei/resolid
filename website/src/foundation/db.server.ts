import { env } from "node:process";
import { defineDatabase } from "@resolid/framework";
import { __DEV__ } from "@resolid/utils";

export const db = defineDatabase({
  dbUrl: env.RX_DB_URL,
  pgOptions: {
    max: env.VERCEL == "1" ? 1 : 10,
  },
  drizzleOptions: {
    logger: __DEV__,
  },
});
