import { relations } from "drizzle-orm";
import { index, integer, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { defineTable } from "../../foundation/schema";

export const userTable = defineTable(
  "user",
  {
    id: serial("id").primaryKey(),
    userGroupId: integer("userGroupId").notNull().default(0),
    email: text("email").notNull().default(""),
    emailVerifiedAt: timestamp("emailVerifiedAt"),
    password: text("password").notNull().default(""),
    username: text("username").notNull().default(""),
    nickname: text("nickname").notNull().default(""),
    avatar: text("avatar").notNull().default(""),
    createdIp: text("createdIp").notNull().default(""),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt"),
    deletedAt: timestamp("deletedAt"),
  },
  (userTable) => ({
    emailIndex: uniqueIndex("emailIndex").on(userTable.email),
    usernameIndex: uniqueIndex("usernameIndex").on(userTable.username),
    nicknameIndex: index("nicknameIndex").on(userTable.nickname),
    deletedAtIndex: index("deletedAtIndex").on(userTable.deletedAt),
    userGroupIdIndex: index("userGroupIdIndex").on(userTable.userGroupId),
  }),
);

export const userGroupTable = defineTable("user_group", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default(""),
  color: text("color").notNull().default(""),
  icon: text("icon").notNull().default(""),
});

export const userTableRelations = relations(userTable, ({ one }) => ({
  userGroup: one(userGroupTable, {
    fields: [userTable.userGroupId],
    references: [userGroupTable.id],
  }),
}));
