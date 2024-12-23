import { defineMailer } from "@resolid/framework";
import { env } from "node:process";

export const mailer = defineMailer({
  dsn: env.RX_MAILER_DSN,
  from: env.RX_MAILER_FROM,
});
