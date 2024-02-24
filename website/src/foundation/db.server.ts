import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "node:process";
import postgres from "postgres";

import * as systemSchema from "~/modules/system/systemSchema.server";

env.TZ = "UTC";

const pg = postgres(
  `postgres://${env.RX_DB_USER}:${env.RX_DB_PASSWORD}@${env.RX_DB_HOST}/${env.RX_DB_DATABASE}?sslmode=require`,
  {
    max: env.RX_RUNTIME == "vercel" ? 1 : 10,
    transform: {
      undefined: null,
    },
  },
);

export const db = drizzle(pg, {
  schema: { ...systemSchema },
  logger: env.NODE_ENV == "development",
});
