import { index, uniqueIndex } from "@resolid/framework/drizzle";
import { type AuthIdentity, authColumns, authGroupColumns, authSessionColumns } from "@resolid/framework/modules";
import { defineTable } from "~/foundation/schema.server";

export type AdminSelect = typeof adminTable.$inferSelect;
export type AdminGroupSelect = typeof adminGroupTable.$inferSelect;
export type AdminSelectWithGroup = AdminSelect & { group: AdminGroupSelect };

export type AdminIdentity = AuthIdentity<AdminSelectWithGroup>;

export const adminTable = defineTable("admin", authColumns, (table) => [
  uniqueIndex().on(table.email),
  uniqueIndex().on(table.username),
  index().on(table.nickname),
  index().on(table.groupId),
  index().on(table.deletedAt),
]);

export const adminGroupTable = defineTable("admin_group", authGroupColumns);

export const adminSessionTable = defineTable("admin_session", authSessionColumns, (table) => [
  index().on(table.identityId),
]);
