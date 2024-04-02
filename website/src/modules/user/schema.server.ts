import { defineTable } from "@resolid/framework";
import { boolean, integer, relations, timestamp, varchar } from "@resolid/framework/drizzle";
import { userTable } from "@resolid/framework/schemas";

export const userPasswordResetTable = defineTable("user_password_reset", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: integer("userId").notNull().default(0),
  redeemed: boolean("redeemed").default(false),
  expiredAt: timestamp("expiredAt"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const userResetPasswordTableRelations = relations(userPasswordResetTable, ({ one }) => ({
  user: one(userTable, {
    fields: [userPasswordResetTable.userId],
    references: [userTable.id],
  }),
}));
