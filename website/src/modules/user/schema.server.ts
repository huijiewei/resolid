import { index, timestamp, uniqueIndex, varchar } from "@resolid/framework/drizzle";
import {
  type AuthIdentity,
  authColumns,
  authGroupColumns,
  authPasswordResetColumns,
  authSessionColumns,
} from "@resolid/framework/modules.server";
import { defineTable } from "~/foundation/schema.server";

export type UserSelect = typeof userTable.$inferSelect;
export type UserGroupSelect = typeof userGroupTable.$inferSelect;
export type UserSelectWithGroup = UserSelect & { group: UserGroupSelect };

export type UserIdentity = AuthIdentity<UserSelectWithGroup>;

export const userTable = defineTable(
  "user",
  {
    ...authColumns,
    emailVerifiedAt: timestamp(),
    createdIp: varchar({ length: 60 }).notNull().default(""),
    createdFrom: varchar({ length: 20 }).notNull().default(""),
  },
  (table) => ({
    email: uniqueIndex("email").on(table.email),
    username: uniqueIndex("username").on(table.username),
    nickname: index("nickname").on(table.nickname),
    groupId: index("groupId").on(table.groupId),
    deletedAt: index("deletedAt").on(table.deletedAt),
  }),
);

export const userGroupTable = defineTable("user_group", authGroupColumns);

export const userSessionTable = defineTable("user_session", authSessionColumns, (table) => ({
  identityId: index("identityId").on(table.identityId),
}));

export const userPasswordResetTable = defineTable("user_password_reset", authPasswordResetColumns);
