import { pgTableCreator } from "@resolid/framework/drizzle";
import { env } from "node:process";

export const defineTable = pgTableCreator((name) => env.RX_DB_TABLE_PREFIX + name);
