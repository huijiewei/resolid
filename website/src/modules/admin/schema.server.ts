import { index, uniqueIndex } from "@resolid/framework/drizzle";
import { type AuthIdentity, authColumns, authGroupColumns, authSessionColumns } from "@resolid/framework/modules";
import { defineTable } from "~/foundation/schema.server";

export type AdminSelect = typeof adminTable.$inferSelect;
export type AdminGroupSelect = typeof adminGroupTable.$inferSelect;
export type AdminSelectWithGroup = AdminSelect & { group: AdminGroupSelect };

export type AdminIdentity = AuthIdentity<AdminSelectWithGroup>;

export const adminTable = defineTable("admin", authColumns, (table) => ({
  emailIndex: uniqueIndex().on(table.email),
  usernameIndex: uniqueIndex().on(table.username),
  nicknameIndex: index().on(table.nickname),
  groupIdIndex: index().on(table.groupId),
  deletedAtIndex: index().on(table.deletedAt),
}));

export const adminGroupTable = defineTable("admin_group", authGroupColumns);

export const adminSessionTable = defineTable("admin_session", authSessionColumns, (table) => ({
  identityIdIndex: index().on(table.identityId),
}));
