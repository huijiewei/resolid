import { defineDatabase } from "@resolid/framework";
import { __DEV__ } from "@resolid/utils";
import { env } from "node:process";

import * as systemSchema from "~/modules/system/schema.server";

env.TZ = "UTC";

export const db = defineDatabase({
  pgOptions: {
    max: env.RX_RUNTIME == "vercel" ? 1 : 10,
  },
  drizzleOptions: {
    schema: { ...systemSchema },
    logger: __DEV__,
  },
});
