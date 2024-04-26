import { __DEV__ } from "@resolid/utils";
import type { DrizzleConfig } from "drizzle-orm";
import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres, { type Options } from "postgres";
import { singleton } from "../utils/singleton";

export type DatabaseOptions<
  PT extends Record<string, postgres.PostgresType>,
  TSchema extends Record<string, unknown>,
> = {
  dbUrl: string;
  pgOptions?: Options<PT>;
  drizzleOptions?: DrizzleConfig<TSchema>;
};

export const defineDatabase = <
  PT extends Record<string, postgres.PostgresType> = Record<string, never>,
  TSchema extends Record<string, unknown> = Record<string, never>,
>({
  dbUrl,
  pgOptions,
  drizzleOptions = {},
}: DatabaseOptions<PT, TSchema>) => {
  const pg = postgres(dbUrl, {
    transform: {
      undefined: null,
    },
    prepare: false,
    ...pgOptions,
  });

  return __DEV__
    ? singleton(
        "db",
        () => drizzle(pg, drizzleOptions) as PostgresJsDatabase<TSchema & (typeof drizzleOptions)["schema"]>,
      )
    : (drizzle(pg, drizzleOptions) as PostgresJsDatabase<TSchema & (typeof drizzleOptions)["schema"]>);
};
