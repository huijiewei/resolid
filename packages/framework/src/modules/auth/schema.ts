import { boolean, integer, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const authColumns = {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 10021 }),
  groupId: integer().notNull().default(0),
  password: text().notNull().default(""),
  email: text().notNull().default(""),
  username: text().notNull().default(""),
  nickname: text().notNull().default(""),
  avatar: text().notNull().default(""),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
  deletedAt: timestamp(),
};

export const RX_DEFAULT_AUTH_GROUP_ID = 101;

export const authGroupColumns = {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: RX_DEFAULT_AUTH_GROUP_ID }),
  name: text().notNull().default(""),
  color: text().notNull().default(""),
  icon: text().notNull().default(""),
};

export const authSessionColumns = {
  id: varchar({ length: 32 }).primaryKey(),
  identityId: integer().notNull().default(0),
  expiredAt: timestamp().notNull(),
  remoteAddr: text().notNull().default(""),
  userAgent: text().notNull().default(""),
};

export const authPasswordResetColumns = {
  id: varchar({ length: 32 }).primaryKey(),
  identityId: integer().notNull().default(0),
  redeemed: boolean().default(false),
  expiredAt: timestamp(),
  createdAt: timestamp().notNull().defaultNow(),
};
