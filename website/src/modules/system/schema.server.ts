import { integer, text } from "@resolid/framework/drizzle";
import { defineTable } from "~/foundation/schema.server";

export const statusTable = defineTable("status", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 101 }),
  message: text("message").notNull().default(""),
});
