import { defineConfig } from "drizzle-kit";
import { env } from "node:process";

export default defineConfig({
  schema: ["./src/modules/*/schema.server.ts"],
  driver: "pg",
  dbCredentials: {
    connectionString: env.RX_DB_URL,
  },
});
