import { mysqlTableCreator } from "@resolid/framework/drizzle";
import { env } from "node:process";

export const defineTable = mysqlTableCreator((name) => env.RX_DB_TABLE_PREFIX + name);
