import { env } from "node:process";
import { mysqlTableCreator } from "@resolid/framework/drizzle";

export const defineTable = mysqlTableCreator((name) => env.RX_DB_TABLE_PREFIX + name);
