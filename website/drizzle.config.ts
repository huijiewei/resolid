import { env } from "node:process";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./src/modules/*/schema.server.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: env.RX_DB_URL,
  },
});
