import type { DrizzleConfig } from "drizzle-orm";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { env } from "node:process";
import postgres, { type Options } from "postgres";

import * as schemas from "../modules/schemas";

export type DatabaseOptions<
  PT extends Record<string, postgres.PostgresType>,
  TSchema extends Record<string, unknown>,
> = {
  pgOptions?: Options<PT>;
  drizzleOptions?: DrizzleConfig<TSchema>;
};

export const defineDatabase = <
  PT extends Record<string, postgres.PostgresType> = Record<string, never>,
  TSchema extends Record<string, unknown> = Record<string, never>,
>(
  options: DatabaseOptions<PT, TSchema>,
) => {
  const pg = postgres(env.RX_DB_URL!, {
    transform: {
      undefined: null,
    },
    ...options.pgOptions,
  });

  const drizzleOptions = {
    ...options.drizzleOptions,
    schema: { ...schemas, ...options.drizzleOptions?.schema },
  };

  return drizzle(pg, drizzleOptions) as PostgresJsDatabase<TSchema & (typeof drizzleOptions)["schema"]>;
};

export const drizzleKitConfig = (
  config: {
    schema?: string[];
    verbose?: boolean | undefined;
    strict?: boolean | undefined;
  } = {},
) => {
  return {
    schema: [
      "./node_modules/@resolid/framework/src/foundation/schema.ts",
      "./node_modules/@resolid/framework/src/modules/schemas.ts",
      ...(config.schema ?? []),
    ],
    driver: "pg",
    dbCredentials: {
      connectionString: env.RX_DB_URL,
    },
    verbose: config.verbose,
    strict: config.strict,
  };
};
