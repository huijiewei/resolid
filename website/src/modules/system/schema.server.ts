import { defineTable } from "@resolid/framework";
import { serial, text } from "@resolid/framework/drizzle";

export const statusTable = defineTable("status", {
  id: serial("id").primaryKey(),
  message: text("message").notNull().default(""),
});
