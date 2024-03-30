import { hash, verify } from "@node-rs/bcrypt";
import { omit } from "@resolid/utils";
import { desc, eq } from "drizzle-orm";
import { db } from "../../foundation/alias";
import { FieldException } from "../../utils/exceptions";
import type { ServiceResult } from "../../utils/service";
import { createFieldErrors, validateData } from "../../utils/zod";
import { userGroupTable, userTable } from "./schema";
import { userLoginResolver, userSignupResolver, type UserLoginFormData, type UserSignupFormData } from "./validator";

export { userGroupTable, userTable };

export type UserSelect = typeof userTable.$inferSelect;
export type UserSelectWithGroup = UserSelect & { userGroup: UserGroupSelect };
export type UserInsert = typeof userTable.$inferInsert & { userGroupId: number };

export type UserGroupSelect = typeof userGroupTable.$inferSelect;
export type UserGroupInsert = typeof userGroupTable.$inferInsert;

type WithInput = NonNullable<Parameters<(typeof db)["query"]["userTable"]["findFirst"]>[0]>["with"];
type ColumnsInput = NonNullable<Parameters<(typeof db)["query"]["userTable"]["findFirst"]>[0]>["columns"];

export type UserAuthSession = Omit<UserSelectWithGroup, "password" | "updatedAt" | "deletedAt">;

const userToAuthSession = (user: UserSelectWithGroup) => {
  return omit(user, ["password", "updatedAt", "deletedAt"]);
};

const getUserByField = async <R extends UserSelect | UserSelectWithGroup>(
  field: keyof UserSelect,
  value: string | number,
  columns?: ColumnsInput,
  withInput?: WithInput,
): Promise<R | undefined> => {
  return (await db.query.userTable.findFirst({
    columns,
    where: eq(userTable[field], value),
    with: withInput,
  })) as R;
};

const insertUser = async (user: UserInsert) => {
  if (user.email && (await userService.existByEmail(user.email))) {
    throw new FieldException("email", "邮箱已存在");
  }

  if (user.username && (await userService.existByUsername(user.username))) {
    throw new FieldException("username", "用户名已存在");
  }

  if (user.nickname && (await userService.existByUsername(user.nickname))) {
    throw new FieldException("username", "昵称已存在");
  }

  const userGroup = await userService.getUserGroupById(user.userGroupId);

  if (!userGroup) {
    throw new FieldException("userGroupId", "用户组不存在");
  }

  user.password = await hash(user.password!);

  const inserted = await db.insert(userTable).values(user).returning();

  return { ...inserted[0], userGroup };
};

export const userService = {
  getLast: async (): Promise<UserSelect | undefined> => {
    return db.query.userTable.findFirst({
      orderBy: [desc(userTable.id)],
    });
  },
  getById: async (id: number): Promise<UserSelectWithGroup | undefined> => {
    return getUserByField("id", id, undefined, { userGroup: true });
  },
  getByEmail: async (email: string): Promise<UserSelectWithGroup | undefined> => {
    return getUserByField("email", email, undefined, { userGroup: true });
  },
  existByEmail: async (email: string) => {
    return (await getUserByField("email", email, { email: true })) != undefined;
  },
  getByUsername: async (username: string): Promise<UserSelectWithGroup | undefined> => {
    return getUserByField("username", username, undefined, { userGroup: true });
  },
  existByUsername: async (username: string) => {
    return (await getUserByField("username", username, { username: true })) != undefined;
  },
  getByNickname: async (nickname: string): Promise<UserSelectWithGroup | undefined> => {
    return getUserByField("nickname", nickname, undefined, { userGroup: true });
  },
  existByNickname: async (nickname: string) => {
    return (await getUserByField("nickname", nickname, { nickname: true })) != undefined;
  },
  getUserGroups: async (): Promise<UserGroupSelect[]> => {
    return db.query.userGroupTable.findMany();
  },
  getUserGroupById: async (id: number) => {
    return db.query.userGroupTable.findFirst({
      where: eq(userGroupTable.id, id),
    });
  },
  authLogin: async (data: UserLoginFormData): Promise<ServiceResult<UserLoginFormData, UserAuthSession>> => {
    const { errors, values } = await validateData(data, userLoginResolver);

    if (errors) {
      return [errors, undefined];
    }

    const user = await userService.getByEmail(values?.email);

    if (!user) {
      return [createFieldErrors({ email: "用户不存在" }), undefined];
    }

    if (!(await verify(data.password, user.password))) {
      return [createFieldErrors({ password: "密码错误" }), undefined];
    }

    return [undefined, userToAuthSession(user)];
  },
  authSignup: async (data: UserSignupFormData): Promise<ServiceResult<UserSignupFormData, UserAuthSession>> => {
    const { errors, values } = await validateData(data, userSignupResolver);

    if (errors) {
      return [errors, undefined];
    }

    try {
      const user = await insertUser({ ...values, userGroupId: 1 });

      return [undefined, userToAuthSession(user)];
    } catch (e) {
      return [(e as FieldException).toFieldErrors(), undefined];
    }
  },
};
