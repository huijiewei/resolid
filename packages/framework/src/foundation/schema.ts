import { pgTableCreator } from "drizzle-orm/pg-core";
import { env } from "node:process";

export const defineTable = pgTableCreator((name) => {
  const tablePrefix = env.RX_DB_TABLE_PREFIX ?? "";

  return tablePrefix + name;
});
