import type { Config } from "drizzle-kit";
import { env } from "node:process";

export default {
  schema: ["./src/foundation/schema.server.ts", "./src/modules/*/*Schema.server.ts"],
  driver: "pg",
  dbCredentials: {
    connectionString: `postgres://${env.RX_DB_USER}:${env.RX_DB_PASSWORD}@${env.RX_DB_HOST}/${env.RX_DB_DATABASE}?sslmode=require`,
  },
} satisfies Config;
