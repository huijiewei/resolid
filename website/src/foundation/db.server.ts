import { env } from "node:process";
import { defineDatabase } from "@resolid/framework";
import { __DEV__ } from "@resolid/utils";

export const db = await defineDatabase({
  dbUri: env.RX_DB_URI,
  mysqlOptions: {
    ssl: {
      rejectUnauthorized: true,
      ca: env.RX_DB_SSL_CA.replace(/\\n/gm, "\n"),
    },
  },
  drizzleConfig: {
    logger: __DEV__,
  },
});
