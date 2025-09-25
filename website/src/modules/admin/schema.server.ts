import {
  type AuthIdentity,
  authColumns,
  authGroupColumns,
  authSessionColumns,
} from "@resolid/framework/modules.server";
import { index, uniqueIndex } from "drizzle-orm/mysql-core";
import { defineTable } from "~/foundation/schema.server";

export type AdminSelect = typeof adminTable.$inferSelect;
export type AdminGroupSelect = typeof adminGroupTable.$inferSelect;
export type AdminSelectWithGroup = AdminSelect & { group: AdminGroupSelect };

export type AdminIdentity = AuthIdentity<AdminSelectWithGroup>;

export const adminTable = defineTable("admin", authColumns, (table) => [
  uniqueIndex("email").on(table.email),
  uniqueIndex("username").on(table.username),
  index("nickname").on(table.nickname),
  index("groupId").on(table.groupId),
  index("deletedAt").on(table.deletedAt),
]);

export const adminGroupTable = defineTable("admin_group", authGroupColumns);

export const adminSessionTable = defineTable("admin_session", authSessionColumns, (table) => [
  index("identityId").on(table.identityId),
]);
