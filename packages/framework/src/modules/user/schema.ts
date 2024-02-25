import { relations } from "drizzle-orm";
import { index, integer, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { resolidTable } from "../../foundation/schema";

export const users = resolidTable(
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
  (users) => ({
    emailIndex: uniqueIndex("emailIndex").on(users.email),
    usernameIndex: uniqueIndex("usernameIndex").on(users.username),
    nicknameIndex: index("nicknameIndex").on(users.nickname),
    deletedAtIndex: index("deletedAtIndex").on(users.deletedAt),
    userGroupIdIndex: index("userGroupIdIndex").on(users.userGroupId),
  }),
);

export const userGroups = resolidTable("user_group", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default(""),
  color: text("color").notNull().default(""),
  icon: text("icon").notNull().default(""),
});

export const usersRelations = relations(users, ({ one }) => ({
  userGroup: one(userGroups, {
    fields: [users.userGroupId],
    references: [userGroups.id],
  }),
}));
