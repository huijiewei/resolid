import { index, text, timestamp, uniqueIndex } from "@resolid/framework/drizzle";
import type { AuthIdentity } from "@resolid/framework/modules";
import {
  authColumns,
  authGroupColumns,
  authPasswordResetColumns,
  authSessionColumns,
} from "@resolid/framework/modules";
import { defineTable } from "~/foundation/schema.server";

export type UserSelect = typeof userTable.$inferSelect;
export type UserGroupSelect = typeof userGroupTable.$inferSelect;
export type UserSelectWithGroup = UserSelect & { group: UserGroupSelect };

export type UserIdentity = AuthIdentity<UserSelectWithGroup>;

export const userTable = defineTable(
  "user",
  {
    ...authColumns,
    emailVerifiedAt: timestamp("emailVerifiedAt"),
    createdIp: text("createdIp").notNull().default(""),
    createdFrom: text("createdFrom").notNull().default(""),
  },
  (table) => ({
    emailIndex: uniqueIndex().on(table.email),
    usernameIndex: uniqueIndex().on(table.username),
    nicknameIndex: index().on(table.nickname),
    groupIdIndex: index().on(table.groupId),
    deletedAtIndex: index().on(table.deletedAt),
  }),
);

export const userGroupTable = defineTable("user_group", authGroupColumns);

export const userSessionTable = defineTable("user_session", authSessionColumns, (table) => ({
  identityIdIndex: index().on(table.identityId),
}));

export const userPasswordResetTable = defineTable("user_password_reset", authPasswordResetColumns);
