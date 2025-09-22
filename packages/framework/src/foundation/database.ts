import { attachDatabasePool } from "@vercel/functions";
import type { DrizzleConfig, Simplify } from "drizzle-orm";
import type { Mode } from "drizzle-orm/mysql-core";
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import mysql, { type ConnectionOptions } from "mysql2";
import { singleton } from "../utils/singleton";

export type DatabaseOptions<TSchema extends Record<string, unknown>> = {
  dbUri: string;
  mysqlMode?: Mode;
  vercelPool?: boolean;
  mysqlOptions?: Simplify<
    Omit<
      ConnectionOptions,
      | "host"
      | "port"
      | "user"
      | "password"
      | "password1"
      | "password2"
      | "password3"
      | "passwordSha1"
      | "database"
      | "uri"
    >
  >;
  drizzleConfig?: DrizzleConfig<TSchema>;
};

export const defineDatabase = async <TSchema extends Record<string, unknown> = Record<string, never>>({
  dbUri,
  mysqlMode = "default",
  vercelPool = false,
  mysqlOptions = {},
  drizzleConfig = {},
}: DatabaseOptions<TSchema>) => {
  const mysqlConfig: ConnectionOptions = {
    uri: dbUri,
    charset: "utf8mb4",
    ...mysqlOptions,
  };

  const conn = mysql.createPool(mysqlConfig);

  if (vercelPool) {
    attachDatabasePool(conn);
  }

  const config = {
    mode: mysqlMode,
    ...drizzleConfig,
  };

  return !vercelPool
    ? singleton("db", () => drizzle(conn, config) as MySql2Database<TSchema & (typeof drizzleConfig)["schema"]>)
    : (drizzle(conn, config) as MySql2Database<TSchema & (typeof drizzleConfig)["schema"]>);
};
