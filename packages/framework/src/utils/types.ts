import type { BuildColumns } from "drizzle-orm/column-builder";
import type { MySqlColumnBuilderBase, MySqlTableWithColumns } from "drizzle-orm/mysql-core";

export type DefineTable<
  TColumnsMap extends Record<string, MySqlColumnBuilderBase>,
  TSchema extends string | undefined = undefined,
> = MySqlTableWithColumns<{
  name: string;
  schema: TSchema;
  columns: BuildColumns<string, TColumnsMap, "mysql">;
  dialect: "mysql";
}>;
