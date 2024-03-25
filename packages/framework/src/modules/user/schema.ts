import { relations } from "drizzle-orm";
import { index, integer, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { authGroupSchema, authSchema, authSessionSchema } from "../../core/auth/schema";
import { defineTable } from "../../foundation/schema";

export const userTable = defineTable(
  "user",
  {
    ...authSchema,
    userGroupId: integer("userGroupId").notNull().default(0),
    email: text("email").notNull().default(""),
    emailVerifiedAt: timestamp("emailVerifiedAt"),
    createdIp: text("createdIp").notNull().default(""),
    deletedAt: timestamp("deletedAt"),
  },
  (table) => ({
    emailIndex: uniqueIndex().on(table.email),
    usernameIndex: uniqueIndex().on(table.username),
    nicknameIndex: index().on(table.nickname),
    deletedAtIndex: index().on(table.deletedAt),
    userGroupIdIndex: index().on(table.userGroupId),
  }),
);

export const userGroupTable = defineTable("user_group", {
  ...authGroupSchema,
});

export const userTableRelations = relations(userTable, ({ one }) => ({
  userGroup: one(userGroupTable, {
    fields: [userTable.userGroupId],
    references: [userGroupTable.id],
  }),
}));

export const userSessionTable = defineTable("user_session", {
  ...authSessionSchema,
  userId: integer("userId").notNull().default(0),
});
