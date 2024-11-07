import { index, uniqueIndex } from "@resolid/framework/drizzle";
import { type AuthIdentity, authColumns, authGroupColumns, authSessionColumns } from "@resolid/framework/modules";
import { defineTable } from "~/foundation/schema.server";

export type AdminSelect = typeof adminTable.$inferSelect;
export type AdminGroupSelect = typeof adminGroupTable.$inferSelect;
export type AdminSelectWithGroup = AdminSelect & { group: AdminGroupSelect };

export type AdminIdentity = AuthIdentity<AdminSelectWithGroup>;

export const adminTable = defineTable("admin", authColumns, (table) => ({
  email: uniqueIndex("email").on(table.email),
  username: uniqueIndex("username").on(table.username),
  nickname: index("nickname").on(table.nickname),
  groupId: index("groupId").on(table.groupId),
  deletedAt: index("deletedAt").on(table.deletedAt),
}));

export const adminGroupTable = defineTable("admin_group", authGroupColumns);

export const adminSessionTable = defineTable("admin_session", authSessionColumns, (table) => ({
  identityId: index("identityId").on(table.identityId),
}));
