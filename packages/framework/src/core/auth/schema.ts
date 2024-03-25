import { serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const authSchema = {
  id: serial("id").primaryKey(),
  password: text("password").notNull().default(""),
  username: text("username").notNull().default(""),
  nickname: text("nickname").notNull().default(""),
  avatar: text("avatar").notNull().default(""),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt"),
};

export const authGroupSchema = {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default(""),
  color: text("color").notNull().default(""),
  icon: text("icon").notNull().default(""),
};

export const authSessionSchema = {
  id: varchar("id", { length: 36 }).primaryKey(),
  expiredAt: timestamp("expiredAt"),
};
