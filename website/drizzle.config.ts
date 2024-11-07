import { env } from "node:process";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./src/modules/*/schema.server.ts"],
  dialect: "mysql",
  dbCredentials: {
    url: env.RX_DB_URI,
    ssl: {
      rejectUnauthorized: true,
      ca: env.RX_DB_SSL_CA.replace(/\\n/gm, "\n"),
    },
  },
});
