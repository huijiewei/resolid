import { relations } from "drizzle-orm";
import { index, integer, uniqueIndex } from "drizzle-orm/pg-core";
import { authGroupSchema, authSchema, authSessionSchema } from "../../core/auth/schema";
import { defineTable } from "../../foundation/schema";

export const adminTable = defineTable(
  "admin",
  {
    ...authSchema,
    adminGroupId: integer("adminGroupId").notNull().default(0),
  },
  (table) => ({
    usernameIndex: uniqueIndex().on(table.username),
    nicknameIndex: index().on(table.nickname),
    adminGroupIdIndex: index().on(table.adminGroupId),
  }),
);

export const adminGroupTable = defineTable("admin_group", {
  ...authGroupSchema,
});

export const adminTableRelations = relations(adminTable, ({ one }) => ({
  adminGroup: one(adminGroupTable, {
    fields: [adminTable.adminGroupId],
    references: [adminGroupTable.id],
  }),
}));

export const adminSessionTable = defineTable("admin_session", {
  ...authSessionSchema,
  adminId: integer("adminId").notNull().default(0),
});
