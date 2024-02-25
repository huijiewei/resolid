import { pgTableCreator } from "drizzle-orm/pg-core";
import { env } from "node:process";

export const resolidTable = pgTableCreator((name) => {
  const tablePrefix = env.RX_DB_TABLE_PREFIX ?? "";

  return tablePrefix + name;
});
