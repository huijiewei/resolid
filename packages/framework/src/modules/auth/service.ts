import { hash, verify } from "@node-rs/bcrypt";
import { isEmpty, omit } from "@resolid/utils";
import { and, eq, getTableColumns, gt, inArray, isNull, type InferSelectModel, type Simplify } from "drizzle-orm";
import type { MySql2Database } from "drizzle-orm/mysql2";
import { nanoid } from "nanoid";
import type { Resolver } from "react-hook-form";
import type { ServiceResult } from "../../utils/service";
import type { DefineTable } from "../../utils/types";
import { createFieldErrors, validateData } from "../../utils/validate";
import type { authColumns, authGroupColumns, authPasswordResetColumns, authSessionColumns } from "./schema";
import type {
  AuthLoginFormData,
  AuthPasswordForgotFormData,
  AuthPasswordResetFormData,
  AuthSignupFormData,
} from "./validator";

export type AuthSessionData<T> = {
  identity: T;
  remoteAddr: string;
  userAgent: string;
};

export type AuthSessionService<T> = {
  getIdentity: (sessionId: string) => Promise<T | undefined>;
  createSession: (sessionData: AuthSessionData<T>, expiredAt: Date) => Promise<string>;
  updateSession: (sessionId: string, sessionData: AuthSessionData<T>, expiredAt: Date) => Promise<void>;
  removeSession: (sessionId: string) => Promise<void>;
};

type AuthTable = DefineTable<typeof authColumns>;
type AuthGroupTable = DefineTable<typeof authGroupColumns>;
type AuthSessionTable = DefineTable<typeof authSessionColumns>;
type AuthPasswordResetTable = DefineTable<typeof authPasswordResetColumns>;

type AuthSelect = InferSelectModel<AuthTable>;
type AuthGroupSelect = InferSelectModel<AuthGroupTable>;
type AuthSelectWithGroup = AuthSelect & { group: AuthGroupSelect };

type DatabaseInstance = InstanceType<typeof MySql2Database>;

export type AuthIdentity<T extends AuthSelectWithGroup | AuthSelect> = Simplify<
  Omit<T, "password" | "createdAt" | "updatedAt" | "deletedAt">
>;

const omitIdentity = <T extends AuthSelectWithGroup | AuthSelect>(identity: T): AuthIdentity<T> => {
  return omit(identity, ["password", "createdAt", "updatedAt", "deletedAt"]);
};

export const createAuthLoginService = <T extends AuthLoginFormData, R extends AuthSelectWithGroup>(
  database: DatabaseInstance,
  authTable: AuthTable,
  authGroupTable: AuthGroupTable,
  authLoginResolver: Resolver<T>,
) => {
  return async (data: T): Promise<ServiceResult<T, AuthIdentity<R>>> => {
    const result = await validateData<T>(data, authLoginResolver);

    if (!result.success) {
      return [result.errors, undefined];
    }

    const identities = await database
      .select({
        ...getTableColumns(authTable),
        group: getTableColumns(authGroupTable),
      })
      .from(authTable)
      .where(and(eq(authTable.email, result.values.email), isNull(authTable.deletedAt)))
      .leftJoin(authGroupTable, eq(authGroupTable.id, authTable.groupId))
      .limit(1);

    if (identities.length == 0) {
      return [createFieldErrors<T>({ email: "用户不存在" }), undefined];
    }

    if (!(await verify(result.values.password, identities[0].password))) {
      return [createFieldErrors<T>({ password: "密码错误" }), undefined];
    }

    return [undefined, omitIdentity(identities[0] as R)];
  };
};

export const createAuthBaseService = (
  database: DatabaseInstance,
  authTable: AuthTable,
  authGroupTable: AuthGroupTable,
) => {
  return {
    emailExists: async (email: string): Promise<boolean> => {
      return (await database.$count(authTable, eq(authTable.email, email))) > 0;
    },
    usernameExists: async (username: string): Promise<boolean> => {
      return (await database.$count(authTable, eq(authTable.username, username))) > 0;
    },
    nicknameExists: async (nickname: string): Promise<boolean> => {
      return (await database.$count(authTable, eq(authTable.nickname, nickname))) > 0;
    },
    getGroupById: async <T extends AuthGroupSelect>(groupId: number): Promise<T | undefined> => {
      const groups = await database.select().from(authGroupTable).where(eq(authGroupTable.id, groupId)).limit(1);

      if (groups.length == 0) {
        return undefined;
      }

      return groups[0] as T;
    },
  };
};

export const createAuthSignupService = <T extends AuthSignupFormData, R extends AuthSelectWithGroup>(
  database: DatabaseInstance,
  authTable: AuthTable,
  authGroupTable: AuthGroupTable,
  authSignupResolver: Resolver<T>,
) => {
  return async (data: T, defaultGroupId: number): Promise<ServiceResult<T, AuthIdentity<R>>> => {
    const result = await validateData<T>(data, authSignupResolver);

    if (!result.success) {
      return [result.errors, undefined];
    }

    const authBaseService = createAuthBaseService(database, authTable, authGroupTable);

    if (result.values.email && (await authBaseService.emailExists(result.values.email))) {
      return [createFieldErrors<T>({ email: "邮箱已存在" }), undefined];
    }

    if (result.values.username && (await authBaseService.usernameExists(result.values.username))) {
      return [createFieldErrors<T>({ username: "用户名已存在" }), undefined];
    }

    if (result.values.nickname && (await authBaseService.nicknameExists(result.values.nickname))) {
      return [createFieldErrors<T>({ nickname: "昵称已存在" }), undefined];
    }

    const group = await authBaseService.getGroupById(defaultGroupId);

    if (!group) {
      return [createFieldErrors<T>({ groupId: "组不存在" }), undefined];
    }

    const identities = await database
      .insert(authTable)
      .values({ ...result.values, password: await hash(result.values.password), groupId: defaultGroupId })
      .$returningId();

    const identity = {
      id: identities[0].id,
      ...omit(result.values, ["confirmPassword"]),
      group: group,
    } as unknown as R;

    return [undefined, omitIdentity(identity)];
  };
};

export const createAuthSessionService = <T extends AuthSelectWithGroup>(
  database: DatabaseInstance,
  authTable: AuthTable,
  authGroupTable: AuthGroupTable,
  authSessionTable: AuthSessionTable,
): AuthSessionService<AuthIdentity<T>> => {
  const getIdentity: AuthSessionService<AuthIdentity<T>>["getIdentity"] = async (sessionId) => {
    const identities = await database
      .select({
        ...getTableColumns(authTable),
        group: getTableColumns(authGroupTable),
      })
      .from(authTable)
      .where(
        and(
          isNull(authTable.deletedAt),
          inArray(
            authTable.id,
            database
              .select({ id: authSessionTable.identityId })
              .from(authSessionTable)
              .where(eq(authSessionTable.id, sessionId)),
          ),
        ),
      )
      .leftJoin(authGroupTable, eq(authGroupTable.id, authTable.groupId))
      .limit(1);

    if (identities.length == 0) {
      return undefined;
    }

    return omitIdentity(identities[0] as T);
  };

  const createSession: AuthSessionService<AuthIdentity<T>>["createSession"] = async (sessionData, expiredAt) => {
    const sessionId = nanoid(16);

    await database.insert(authSessionTable).values({
      id: sessionId,
      identityId: sessionData.identity.id,
      remoteAddr: sessionData.remoteAddr,
      userAgent: sessionData.userAgent,
      expiredAt: expiredAt,
    });

    return sessionId;
  };

  const updateSession: AuthSessionService<AuthIdentity<T>>["updateSession"] = async (
    sessionId,
    sessionData,
    expiredAt,
  ) => {
    const update = {
      identityId: sessionData.identity.id,
      remoteAddr: sessionData.remoteAddr,
      userAgent: sessionData.userAgent,
      expiredAt: expiredAt,
    };

    await database
      .insert(authSessionTable)
      .values({
        id: sessionId,
        ...update,
      })
      .onDuplicateKeyUpdate({
        set: update,
      });
  };

  const removeSession: AuthSessionService<AuthIdentity<T>>["removeSession"] = async (sessionId) => {
    await database.delete(authSessionTable).where(eq(authSessionTable.id, sessionId));
  };

  return {
    getIdentity,
    createSession,
    updateSession,
    removeSession,
  };
};

export const createAuthPasswordForgotService = <T extends AuthPasswordForgotFormData, R extends AuthSelect>(
  database: DatabaseInstance,
  authTable: AuthTable,
  authPasswordResetTable: AuthPasswordResetTable,
  authPasswordForgotResolver: Resolver<T>,
) => {
  return async (
    data: T,
    expiredAt: Date,
    remoteAddr: string,
    userAgent: string,
  ): Promise<ServiceResult<T, { identity: AuthIdentity<R>; resetId: string }>> => {
    const result = await validateData<T>(data, authPasswordForgotResolver);

    if (!result.success) {
      return [result.errors, undefined];
    }

    const identities = await database
      .select()
      .from(authTable)
      .where(and(eq(authTable.email, result.values.email), isNull(authTable.deletedAt)))
      .limit(1);

    if (identities.length == 0) {
      return [createFieldErrors<T>({ email: "电子邮箱并未注册" }), undefined];
    }

    const resetId = nanoid(16);

    await database.insert(authPasswordResetTable).values({
      id: resetId,
      identityId: identities[0].id,
      expiredAt: expiredAt,
      remoteAddr: remoteAddr,
      userAgent: userAgent,
    });

    return [undefined, { identity: omitIdentity(identities[0] as R), resetId }];
  };
};

export const createAuthPasswordResetService = <T extends AuthPasswordResetFormData>(
  database: DatabaseInstance,
  authTable: AuthTable,
  authPasswordResetTable: AuthPasswordResetTable,
  authPasswordResetResolver: Resolver<T>,
) => {
  return async (data: T, token: string | null): Promise<ServiceResult<T, boolean>> => {
    if (isEmpty(token)) {
      return [createFieldErrors<T>({ token: "无效的密码重置链接" }), undefined];
    }

    const result = await validateData<T>(data, authPasswordResetResolver);

    if (!result.success) {
      return [result.errors, undefined];
    }

    const resets = await database
      .select()
      .from(authPasswordResetTable)
      .where(
        and(
          eq(authPasswordResetTable.id, token as string),
          eq(authPasswordResetTable.redeemed, false),
          gt(authPasswordResetTable.expiredAt, new Date()),
        ),
      )
      .limit(1);

    if (resets.length == 0) {
      return [createFieldErrors<T>({ token: "无效的密码重置链接" }), undefined];
    }

    await database
      .update(authTable)
      .set({
        password: await hash(result.values.password),
      })
      .where(eq(authTable.id, resets[0].identityId));

    await database
      .update(authPasswordResetTable)
      .set({ redeemed: true })
      .where(eq(authPasswordResetTable.id, resets[0].id));

    return [undefined, true];
  };
};
