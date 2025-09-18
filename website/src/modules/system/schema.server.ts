import { defineTable } from "~/foundation/schema.server";
import { int, varchar } from "drizzle-orm/mysql-core";

export const statusTable = defineTable("status", {
  id: int().primaryKey().autoincrement(),
  message: varchar({ length: 90 }).notNull().default(""),
});
