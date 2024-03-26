import { desc, eq, sql } from "drizzle-orm";
import { db } from "../../foundation/alias";
import { userGroupTable, userTable } from "./schema";

export { userGroupTable, userTable };

export type UserSelect = typeof userTable.$inferSelect;
export type UserSelectWithGroup = UserSelect & { userGroup: UserGroupSelect };
export type UserInsert = typeof userTable.$inferInsert;

export type UserGroupSelect = typeof userGroupTable.$inferSelect;
export type UserGroupInsert = typeof userGroupTable.$inferInsert;

export const userService = {
  getLast: async (): Promise<UserSelect | undefined> => {
    return await db.query.userTable
      .findFirst({
        orderBy: [desc(userTable.id)],
      })
      .execute();
  },
  getByField: async <T, R extends UserSelect | UserSelectWithGroup>(
    field: keyof UserSelect,
    value: T,
    withRelation?: {
      userGroup?: true;
    },
  ): Promise<R | null> => {
    const prepared = db.query.userTable
      .findFirst({
        where: eq(userTable[field], sql.placeholder("value")),
        with: withRelation,
      })
      .prepare(`getUserByField_${field}`);

    const record = await prepared.execute({ value });

    return (record as R) ?? null;
  },
  getById: async (id: number): Promise<UserSelectWithGroup | null> => {
    return await userService.getByField("id", id, { userGroup: true });
  },
  getByEmail: async (email: string): Promise<UserSelectWithGroup | null> => {
    return await userService.getByField("email", email, { userGroup: true });
  },
  existByEmail: async (email: string) => {
    return (await userService.getByField("email", email)) != null;
  },
  getByUsername: async (username: string): Promise<UserSelectWithGroup | null> => {
    return await userService.getByField("username", username, { userGroup: true });
  },
  existByUsername: async (username: string) => {
    return (await userService.getByField("username", username)) != null;
  },
  getByNickname: async (nickname: string): Promise<UserSelectWithGroup | null> => {
    return await userService.getByField("nickname", nickname, { userGroup: true });
  },
  existByNickname: async (nickname: string) => {
    return (await userService.getByField("nickname", nickname)) != null;
  },
  getUserGroups: async (): Promise<UserGroupSelect[]> => {
    return db.query.userGroupTable.findMany();
  },
};
