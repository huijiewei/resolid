import { count, desc, eq } from "drizzle-orm";
import { db } from "../../foundation/alias";
import { userGroupTable, userTable } from "./schema";

export { userGroupTable, userTable };

export type UserSelect = typeof userTable.$inferSelect;
export type UserSelectWithGroup = UserSelect & { userGroup: UserGroupSelect };
export type UserInsert = typeof userTable.$inferInsert;

export type UserGroupSelect = typeof userGroupTable.$inferSelect;
export type UserGroupInsert = typeof userGroupTable.$inferInsert;

export const userService = {
  getLast: async (): Promise<UserSelect | null> => {
    const users = await db.select().from(userTable).orderBy(desc(userTable.id)).limit(1);

    if (users.length == 0) {
      return null;
    }

    return users[0];
  },
  getById: async (id: number): Promise<UserSelectWithGroup | null> => {
    const users = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, id))
      .leftJoin(userGroupTable, eq(userTable.userGroupId, userGroupTable.id))
      .limit(1);

    if (users.length == 0) {
      return null;
    }

    const { user, user_group } = users[0];

    return { ...user, userGroup: user_group } as UserSelectWithGroup;
  },
  getByEmail: async (email: string): Promise<UserSelectWithGroup | null> => {
    const users = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .leftJoin(userGroupTable, eq(userTable.userGroupId, userGroupTable.id))
      .limit(1);

    if (users.length == 0) {
      return null;
    }

    const { user, user_group } = users[0];

    return { ...user, userGroup: user_group } as UserSelectWithGroup;
  },
  existByEmail: async (email: string) => {
    return (await db.select({ value: count() }).from(userTable).where(eq(userTable.email, email)))[0].value > 0;
  },
  getByUsername: async (username: string): Promise<UserSelectWithGroup | null> => {
    const users = await db
      .select()
      .from(userTable)
      .where(eq(userTable.username, username))
      .leftJoin(userGroupTable, eq(userTable.userGroupId, userGroupTable.id))
      .limit(1);

    if (users.length == 0) {
      return null;
    }

    const { user, user_group } = users[0];

    return { ...user, userGroup: user_group } as UserSelectWithGroup;
  },
  existByUsername: async (username: string) => {
    return (await db.select({ value: count() }).from(userTable).where(eq(userTable.username, username)))[0].value > 0;
  },
  getByNickname: async (nickname: string): Promise<UserSelectWithGroup | null> => {
    const users = await db
      .select()
      .from(userTable)
      .where(eq(userTable.nickname, nickname))
      .leftJoin(userGroupTable, eq(userTable.userGroupId, userGroupTable.id))
      .limit(1);

    if (users.length == 0) {
      return null;
    }

    const { user, user_group } = users[0];

    return { ...user, userGroup: user_group } as UserSelectWithGroup;
  },
  existByNickname: async (nickname: string) => {
    return (await db.select({ value: count() }).from(userTable).where(eq(userTable.nickname, nickname)))[0].value > 0;
  },
  getUserGroups: async (): Promise<UserGroupSelect[]> => {
    return db.select().from(userGroupTable);
  },
};
