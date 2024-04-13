import { boolean, integer, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const authColumns = {
  id: serial("id").primaryKey(),
  groupId: integer("groupId").notNull().default(0),
  password: text("password").notNull().default(""),
  email: text("email").notNull().default(""),
  username: text("username").notNull().default(""),
  nickname: text("nickname").notNull().default(""),
  avatar: text("avatar").notNull().default(""),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").$onUpdate(() => new Date()),
  deletedAt: timestamp("deletedAt"),
};

export const authGroupColumns = {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default(""),
  color: text("color").notNull().default(""),
  icon: text("icon").notNull().default(""),
};

export const authSessionColumns = {
  id: varchar("id", { length: 32 }).primaryKey(),
  identityId: integer("identityId").notNull().default(0),
  expiredAt: timestamp("expiredAt").notNull(),
  remoteAddr: text("remoteAddr").notNull().default(""),
  userAgent: text("userAgent").notNull().default(""),
};

export const authPasswordResetColumns = {
  id: varchar("id", { length: 32 }).primaryKey(),
  identityId: integer("identityId").notNull().default(0),
  redeemed: boolean("redeemed").default(false),
  expiredAt: timestamp("expiredAt"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
};
