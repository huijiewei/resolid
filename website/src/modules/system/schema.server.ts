import { int, varchar } from "@resolid/framework/drizzle";
import { defineTable } from "~/foundation/schema.server";

export const statusTable = defineTable("status", {
  id: int().primaryKey().autoincrement(),
  message: varchar({ length: 90 }).notNull().default(""),
});
