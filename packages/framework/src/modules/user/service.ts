import { desc, eq, sql } from "drizzle-orm";
import { db } from "../../foundation/alias";
import { userGroups, users } from "./schema";

export type UserSelect = typeof users.$inferSelect;
export type UserSelectWithGroup = UserSelect & { userGroup: UserGroupSelect };
export type UserInsert = typeof users.$inferInsert;

export type UserGroupSelect = typeof userGroups.$inferSelect;
export type UserGroupInsert = typeof userGroups.$inferInsert;

export const getUserByLast = async (): Promise<UserSelect | undefined> => {
  return await db.query.users
    .findFirst({
      orderBy: desc(users.id),
    })
    .execute();
};

export const getUserById = async (id: number): Promise<UserSelectWithGroup | undefined> => {
  const prepared = db.query.users
    .findFirst({
      where: eq(users.id, sql.placeholder("id")),
      with: {
        userGroup: true,
      },
    })
    .prepare("getUserById");

  return await prepared.execute({ id });
};

export const getUserByEmail = async (email: string): Promise<UserSelectWithGroup | undefined> => {
  const prepared = db.query.users
    .findFirst({
      where: eq(users.email, sql.placeholder("email")),
      with: {
        userGroup: true,
      },
    })
    .prepare("getUserByEmail");

  return await prepared.execute({ email });
};

export const checkExistByEmail = async (email: string) => {
  return (await getUserByEmail(email)) !== undefined;
};

export const getUserByUsername = async (username: string): Promise<UserSelectWithGroup | undefined> => {
  const prepared = db.query.users
    .findFirst({
      where: eq(users.username, sql.placeholder("username")),
      with: {
        userGroup: true,
      },
    })
    .prepare("getUserByUsername");

  return await prepared.execute({ username });
};

export const checkExistByUsername = async (username: string) => {
  return (await getUserByUsername(username)) !== undefined;
};

export const getUserByNickname = async (nickname: string): Promise<UserSelectWithGroup | undefined> => {
  const prepared = db.query.users
    .findFirst({
      where: eq(users.nickname, sql.placeholder("nickname")),
      with: {
        userGroup: true,
      },
    })
    .prepare("getUserByNickname");

  return await prepared.execute({ nickname });
};

export const checkExistByNickname = async (nickname: string) => {
  return (await getUserByNickname(nickname)) !== undefined;
};
