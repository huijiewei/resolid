import type { BuildColumns } from "drizzle-orm/column-builder";
import type { PgTableWithColumns } from "drizzle-orm/pg-core";
import type { PgColumnBuilderBase } from "drizzle-orm/pg-core/columns/common";

export type DefineTable<
  TColumnsMap extends Record<string, PgColumnBuilderBase>,
  TSchema extends string | undefined = undefined,
> = PgTableWithColumns<{
  name: string;
  schema: TSchema;
  columns: BuildColumns<string, TColumnsMap, "pg">;
  dialect: "pg";
}>;
