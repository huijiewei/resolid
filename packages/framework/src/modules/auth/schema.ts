import { sql } from "drizzle-orm";
import { boolean, int, timestamp, varchar } from "drizzle-orm/mysql-core";

export const authColumns = {
  id: int().primaryKey().autoincrement(),
  groupId: int().notNull().default(0),
  password: varchar({ length: 90 }).notNull().default(""),
  email: varchar({ length: 128 }).notNull().default(""),
  username: varchar({ length: 32 }).notNull().default(""),
  nickname: varchar({ length: 32 }).notNull().default(""),
  avatar: varchar({ length: 512 }).notNull().default(""),
  createdAt: timestamp().notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp().onUpdateNow(),
  deletedAt: timestamp(),
};

// noinspection JSUnusedGlobalSymbols
export const RX_DEFAULT_AUTH_GROUP_ID = 101;

export const authGroupColumns = {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 32 }).notNull().default(""),
  color: varchar({ length: 32 }).notNull().default(""),
  icon: varchar({ length: 512 }).notNull().default(""),
};

export const authSessionColumns = {
  id: varchar({ length: 32 }).primaryKey(),
  identityId: int().notNull().default(0),
  createdAt: timestamp().notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp().onUpdateNow(),
  expiredAt: timestamp().notNull(),
  remoteAddr: varchar({ length: 60 }).notNull().default(""),
  userAgent: varchar({ length: 512 }).notNull().default(""),
};

export const authPasswordResetColumns = {
  id: varchar({ length: 32 }).primaryKey(),
  identityId: int().notNull().default(0),
  redeemed: boolean().default(false),
  createdAt: timestamp().notNull().default(sql`CURRENT_TIMESTAMP`),
  expiredAt: timestamp(),
  remoteAddr: varchar({ length: 60 }).notNull().default(""),
  userAgent: varchar({ length: 512 }).notNull().default(""),
};
