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
  ): Promise<R | undefined> => {
    const prepared = db.query.userTable
      .findFirst({
        where: eq(userTable[field], sql.placeholder("value")),
        with: withRelation,
      })
      .prepare(`getUserByField_${field}`);

    return (await prepared.execute({ value })) as R;
  },
  getById: async (id: number): Promise<UserSelectWithGroup | undefined> => {
    return await userService.getByField("id", id, { userGroup: true });
  },
  getByEmail: async (email: string): Promise<UserSelectWithGroup | undefined> => {
    return await userService.getByField("email", email, { userGroup: true });
  },
  existByEmail: async (email: string) => {
    return (await userService.getByField("email", email)) !== undefined;
  },
  getByUsername: async (username: string): Promise<UserSelectWithGroup | undefined> => {
    return await userService.getByField("username", username, { userGroup: true });
  },
  existByUsername: async (username: string) => {
    return (await userService.getByField("username", username)) !== undefined;
  },
  getByNickname: async (nickname: string): Promise<UserSelectWithGroup | undefined> => {
    return await userService.getByField("nickname", nickname, { userGroup: true });
  },
  existByNickname: async (nickname: string) => {
    return (await userService.getByField("nickname", nickname)) !== undefined;
  },
};
