import { defineDatabase } from "@resolid/framework";
import { __DEV__ } from "@resolid/utils";
import { env } from "node:process";

export const db = await defineDatabase({
  dbUri: env.RX_DB_URI,
  dbPool: __DEV__,
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
