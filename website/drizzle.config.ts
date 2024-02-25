import type { Config } from "drizzle-kit";
import { env } from "node:process";

export default <Config>{
  schema: ["./node_modules/@resolid/framework/src/schemas.ts", "./src/modules/*/schema.server.ts"],
  driver: "pg",
  dbCredentials: {
    connectionString: env.RX_DB_URL,
  },
};
