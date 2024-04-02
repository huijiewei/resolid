import { defineDatabase } from "@resolid/framework";
import { __DEV__ } from "@resolid/utils";
import { env } from "node:process";

import * as systemSchema from "~/modules/system/schema.server";
import * as userSchema from "~/modules/user/schema.server";

export const db = defineDatabase({
  pgOptions: {
    max: env.VERCEL == "1" ? 1 : 10,
  },
  drizzleOptions: {
    schema: { ...systemSchema, ...userSchema },
    logger: __DEV__,
  },
});
