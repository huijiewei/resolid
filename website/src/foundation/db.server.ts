import { defineDatabase } from "@resolid/framework";
import { env } from "node:process";

import * as systemSchema from "~/modules/system/schema.server";

env.TZ = "UTC";

export const db = defineDatabase({
  pgOptions: {
    max: env.RX_RUNTIME == "vercel" ? 1 : 10,
  },
  drizzleOptions: {
    schema: { ...systemSchema },
    logger: env.NODE_ENV == "development",
  },
});
