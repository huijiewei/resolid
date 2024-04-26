import { env } from "node:process";
import { defineMailer } from "@resolid/framework";

export const mailer = defineMailer({
  dsn: env.RX_MAILER_DSN,
  from: env.RX_MAILER_FROM,
});
