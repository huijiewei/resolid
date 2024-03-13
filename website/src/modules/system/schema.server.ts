import { resolidTable } from "@resolid/framework";
import { serial, text } from "@resolid/framework/drizzle";

export const status = resolidTable("status", {
  id: serial("id").primaryKey(),
  message: text("message").notNull().default(""),
});
