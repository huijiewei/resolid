import { __DEV__ } from "@resolid/utils";
import type { DrizzleConfig } from "drizzle-orm";
import type { Mode } from "drizzle-orm/mysql-core";
import { type MySql2Database, drizzle } from "drizzle-orm/mysql2";
import mysql, { type ConnectionOptions } from "mysql2/promise";
import { singleton } from "../utils/singleton";

export type DatabaseOptions<TSchema extends Record<string, unknown>> = {
  dbUri: string;
  mysqlMode?: Mode;
  mysqlOptions?: Omit<
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
  >;
  drizzleConfig?: DrizzleConfig<TSchema>;
};

export const defineDatabase = async <TSchema extends Record<string, unknown> = Record<string, never>>({
  dbUri,
  mysqlMode = "default",
  mysqlOptions = {},
  drizzleConfig = {},
}: DatabaseOptions<TSchema>) => {
  const mysqlConfig: ConnectionOptions = {
    uri: dbUri,
    charset: "utf8mb4",
    ...mysqlOptions,
  };

  const conn = __DEV__ ? mysql.createPool(mysqlConfig) : await mysql.createConnection(mysqlConfig);
  const config = {
    mode: mysqlMode,
    ...drizzleConfig,
  };

  return __DEV__
    ? singleton("db", () => drizzle(conn, config) as MySql2Database<TSchema & (typeof drizzleConfig)["schema"]>)
    : (drizzle(conn, config) as MySql2Database<TSchema & (typeof drizzleConfig)["schema"]>);
};
