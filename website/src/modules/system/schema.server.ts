import { serial, text } from "@resolid/framework/drizzle";
import { defineTable } from "~/foundation/schema.server";

export const statusTable = defineTable("status", {
  id: serial("id").primaryKey(),
  message: text("message").notNull().default(""),
});
