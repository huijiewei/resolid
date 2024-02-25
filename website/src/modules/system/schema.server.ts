import { resolidTable } from "@resolid/framework";
import { serial, text } from "drizzle-orm/pg-core";

export const status = resolidTable("status", {
  id: serial("id").primaryKey(),
  message: text("message").notNull().default(""),
});
