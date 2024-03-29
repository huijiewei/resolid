import { verify } from "@node-rs/bcrypt";
import { desc, eq } from "drizzle-orm";
import { db } from "../../foundation/alias";
import type { ServiceResult } from "../../utils/service";
import { createFieldErrors, validateData } from "../../utils/zod";
import { userGroupTable, userTable } from "./schema";
import { userLoginResolver, type UserLoginFormData } from "./validator";

export { userGroupTable, userTable };

export type UserSelect = typeof userTable.$inferSelect;
export type UserSelectWithGroup = UserSelect & { userGroup: UserGroupSelect };
export type UserInsert = typeof userTable.$inferInsert;

export type UserGroupSelect = typeof userGroupTable.$inferSelect;
export type UserGroupInsert = typeof userGroupTable.$inferInsert;

type WithInput = NonNullable<Parameters<(typeof db)["query"]["userTable"]["findFirst"]>[0]>["with"];

export type AuthUserSession = Omit<UserSelectWithGroup, "password" | "updatedAt" | "deletedAt">;

export const userService = {
  _getByField: async <R extends UserSelect | UserSelectWithGroup>(
    field: keyof UserSelect,
    value: string | number,
    withInput?: WithInput,
  ): Promise<R | undefined> => {
    return (await db.query.userTable.findFirst({
      where: eq(userTable[field], value),
      with: withInput,
    })) as R;
  },

  getLast: async (): Promise<UserSelect | undefined> => {
    return db.query.userTable.findFirst({
      orderBy: [desc(userTable.id)],
    });
  },
  getById: async (id: number): Promise<UserSelectWithGroup | undefined> => {
    return userService._getByField("id", id, { userGroup: true });
  },
  getByEmail: async (email: string): Promise<UserSelectWithGroup | undefined> => {
    return userService._getByField("email", email, { userGroup: true });
  },
  existByEmail: async (email: string) => {
    return (await userService._getByField("email", email)) != undefined;
  },
  getByUsername: async (username: string): Promise<UserSelectWithGroup | undefined> => {
    return userService._getByField("username", username, { userGroup: true });
  },
  existByUsername: async (username: string) => {
    return (await userService._getByField("username", username)) != undefined;
  },
  getByNickname: async (nickname: string): Promise<UserSelectWithGroup | undefined> => {
    return userService._getByField("nickname", nickname, { userGroup: true });
  },
  existByNickname: async (nickname: string) => {
    return (await userService._getByField("nickname", nickname)) != undefined;
  },
  getUserGroups: async (): Promise<UserGroupSelect[]> => {
    return db.query.userGroupTable.findMany();
  },
  authLogin: async (data: UserLoginFormData): Promise<ServiceResult<UserLoginFormData, AuthUserSession>> => {
    const { errors, values } = await validateData(data, userLoginResolver);

    if (errors) {
      return [errors, undefined];
    }

    const user = await userService.getByEmail(values?.email);

    if (user == undefined) {
      return [createFieldErrors({ email: "用户不存在" }), undefined];
    }

    if (!(await verify(data.password, user.password))) {
      return [createFieldErrors({ password: "密码错误" }), undefined];
    }

    return [undefined, user];
  },
};
