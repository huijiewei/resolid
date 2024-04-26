import { env } from "node:process";
import { pgTableCreator } from "@resolid/framework/drizzle";

export const defineTable = pgTableCreator((name) => env.RX_DB_TABLE_PREFIX + name);
