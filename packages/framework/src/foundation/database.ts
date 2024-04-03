import { __DEV__ } from "@resolid/utils";
import type { DrizzleConfig } from "drizzle-orm";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { env } from "node:process";
import postgres, { type Options } from "postgres";
import { singleton } from "../utils/singleton";

import * as schemas from "../modules/schemas";

export type DatabaseOptions<
  PT extends Record<string, postgres.PostgresType>,
  TSchema extends Record<string, unknown>,
> = {
  pgOptions?: Options<PT>;
  drizzleOptions?: DrizzleConfig<TSchema>;
};

export type DatabaseInstance = ReturnType<typeof defineDatabase>;

export const defineDatabase = <
  PT extends Record<string, postgres.PostgresType> = Record<string, never>,
  TSchema extends Record<string, unknown> = Record<string, never>,
>(
  options: DatabaseOptions<PT, TSchema>,
) => {
  const dbUrl = env.RX_DB_URL;

  if (!dbUrl) {
    throw new Error("请先设置 RX_DB_URL 环境变量");
  }

  const pg = postgres(dbUrl, {
    transform: {
      undefined: null,
    },
    prepare: false,
    ...options.pgOptions,
  });

  const drizzleOptions = {
    ...options.drizzleOptions,
    schema: { ...schemas, ...options.drizzleOptions?.schema },
  };

  return __DEV__
    ? singleton(
        "db",
        () => drizzle(pg, drizzleOptions) as PostgresJsDatabase<TSchema & (typeof drizzleOptions)["schema"]>,
      )
    : (drizzle(pg, drizzleOptions) as PostgresJsDatabase<TSchema & (typeof drizzleOptions)["schema"]>);
};

export const drizzleKitConfig = (
  config: {
    schema?: string[];
    verbose?: boolean | undefined;
    strict?: boolean | undefined;
  } = {},
) => {
  const dbUrl = env.RX_DB_URL;

  if (!dbUrl) {
    throw new Error("请先设置 RX_DB_URL 环境变量");
  }

  return {
    schema: [
      "./node_modules/@resolid/framework/src/foundation/schema.ts",
      "./node_modules/@resolid/framework/src/modules/schemas.ts",
      ...(config.schema ?? []),
    ],
    driver: "pg",
    dbCredentials: {
      connectionString: dbUrl,
    },
    verbose: config.verbose,
    strict: config.strict,
  };
};
