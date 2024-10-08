import { hash, verify } from "@node-rs/bcrypt";
import { isEmpty, omit, randomId } from "@resolid/utils";
import { type InferSelectModel, type Simplify, and, eq, getTableColumns, gt, inArray, isNull } from "drizzle-orm";
import type { AnyPgTable } from "drizzle-orm/pg-core";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { ServiceResult } from "../../utils/service";
import type { DefineTable } from "../../utils/types";
import { createFieldErrors, validateData } from "../../utils/zod";
import type { authColumns, authGroupColumns, authPasswordResetColumns, authSessionColumns } from "./schema";
import {
  type AuthLoginFormData,
  type AuthPasswordForgotFormData,
  type AuthPasswordResetFormData,
  type AuthSignupFormData,
  type AuthSignupResolver,
  authLoginResolver,
  authPasswordForgotResolver,
  authPasswordResetResolver,
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

type DatabaseInstance = InstanceType<typeof PostgresJsDatabase>;

export type AuthIdentity<T extends AuthSelectWithGroup | AuthSelect> = Simplify<
  Omit<T, "password" | "createdAt" | "updatedAt" | "deletedAt">
>;

const omitIdentity = <T extends AuthSelectWithGroup | AuthSelect>(identity: T): AuthIdentity<T> => {
  return omit(identity, ["password", "createdAt", "updatedAt", "deletedAt"]);
};

// noinspection JSUnusedGlobalSymbols
export const createAuthLoginService = <T extends AuthSelectWithGroup>(
  database: DatabaseInstance,
  authTable: AuthTable,
  authGroupTable: AuthGroupTable,
) => {
  return async (data: AuthLoginFormData): Promise<ServiceResult<AuthLoginFormData, AuthIdentity<T>>> => {
    const { errors, values } = await validateData(data, authLoginResolver);

    if (errors) {
      return [errors, undefined];
    }

    const result = await database
      .select({
        ...getTableColumns(authTable),
        group: getTableColumns(authGroupTable),
      })
      .from(authTable)
      .where(and(eq(authTable.email, values.email), isNull(authTable.deletedAt)))
      .leftJoin(authGroupTable, eq(authGroupTable.id, authTable.groupId))
      .limit(1);

    if (result.length == 0) {
      return [createFieldErrors({ email: "用户不存在" }), undefined];
    }

    const identity = result[0] as T;

    if (!(await verify(values.password, identity.password))) {
      return [createFieldErrors({ password: "密码错误" }), undefined];
    }

    return [undefined, omitIdentity(identity)];
  };
};

export const createAuthBaseService = (
  database: DatabaseInstance,
  authTable: AuthTable,
  authGroupTable: AuthGroupTable,
) => {
  return {
    emailExists: async (email: string): Promise<boolean> => {
      return (await database.select({ id: authTable.id }).from(authTable).where(eq(authTable.email, email))).length > 0;
    },
    usernameExists: async (username: string): Promise<boolean> => {
      return (
        (await database.select({ id: authTable.id }).from(authTable).where(eq(authTable.username, username))).length > 0
      );
    },
    nicknameExists: async (nickname: string): Promise<boolean> => {
      return (
        (await database.select({ id: authTable.id }).from(authTable).where(eq(authTable.nickname, nickname))).length > 0
      );
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

// noinspection JSUnusedGlobalSymbols
export const createAuthSignupService = <T extends AuthSelectWithGroup>(
  database: DatabaseInstance,
  authTable: AuthTable,
  authGroupTable: AuthGroupTable,
  authSignupResolver: AuthSignupResolver,
) => {
  return async (
    data: AuthSignupFormData,
    defaultGroupId: number,
  ): Promise<ServiceResult<AuthSignupFormData, AuthIdentity<T>>> => {
    const { errors, values } = await validateData(data, authSignupResolver);

    if (errors) {
      return [errors, undefined];
    }

    const authService = createAuthBaseService(database, authTable, authGroupTable);

    if (values.email && (await authService.emailExists(values.email))) {
      return [createFieldErrors({ email: "邮箱已存在" }), undefined];
    }

    if (values.username && (await authService.usernameExists(values.username))) {
      return [createFieldErrors({ username: "用户名已存在" }), undefined];
    }

    if (values.nickname && (await authService.nicknameExists(values.nickname))) {
      return [createFieldErrors({ nickname: "昵称已存在" }), undefined];
    }

    const group = await authService.getGroupById(defaultGroupId);

    if (!group) {
      return [createFieldErrors({ groupId: "组不存在" }), undefined];
    }

    const identities = await database
      .insert(authTable as AnyPgTable)
      .values({ ...values, password: await hash(values.password), groupId: defaultGroupId })
      .returning();

    const identity = identities[0];
    identity.group = group;

    return [undefined, omitIdentity(identity as T)];
  };
};

// noinspection JSUnusedGlobalSymbols
export const createAuthSessionService = <T extends AuthSelectWithGroup>(
  database: DatabaseInstance,
  authTable: AuthTable,
  authGroupTable: AuthGroupTable,
  authSessionTable: AuthSessionTable,
): AuthSessionService<AuthIdentity<T>> => {
  const getIdentity: AuthSessionService<AuthIdentity<T>>["getIdentity"] = async (sessionId) => {
    const result = await database
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

    if (result.length == 0) {
      return undefined;
    }

    return omitIdentity(result[0] as T);
  };

  const createSession: AuthSessionService<AuthIdentity<T>>["createSession"] = async (sessionData, expiredAt) => {
    const sessionId = randomId();

    await database.insert(authSessionTable as AnyPgTable).values({
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
      .insert(authSessionTable as AnyPgTable)
      .values({
        id: sessionId,
        ...update,
      })
      .onConflictDoUpdate({
        target: authSessionTable.id,
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

// noinspection JSUnusedGlobalSymbols
export const createAuthPasswordForgotService = (
  database: DatabaseInstance,
  authTable: AuthTable,
  authPasswordResetTable: AuthPasswordResetTable,
  callback: (
    identity: AuthIdentity<AuthSelect>,
    resetId: string,
    requestOrigin: string,
  ) => Promise<[error: Record<string, string>, success: undefined] | [error: undefined, success: true]>,
) => {
  return async (
    data: AuthPasswordForgotFormData,
    requestOrigin: string,
  ): Promise<ServiceResult<AuthPasswordForgotFormData, boolean>> => {
    const { errors, values } = await validateData(data, authPasswordForgotResolver);

    if (errors) {
      return [errors, undefined];
    }

    const identities = await database
      .select()
      .from(authTable)
      .where(and(eq(authTable.email, values.email), isNull(authTable.deletedAt)))
      .limit(1);

    if (identities.length == 0) {
      return [createFieldErrors({ email: "电子邮箱并未注册" }), undefined];
    }

    const resetId = randomId();

    await database.insert(authPasswordResetTable as AnyPgTable).values({
      id: resetId,
      identityId: identities[0].id,
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    const [error] = await callback(identities[0], resetId, requestOrigin);

    if (error) {
      return [createFieldErrors(error), undefined];
    }

    return [undefined, true];
  };
};

// noinspection JSUnusedGlobalSymbols
export const createAuthPasswordResetService = (
  database: DatabaseInstance,
  authTable: AuthTable,
  authPasswordResetTable: AuthPasswordResetTable,
) => {
  return async (
    data: AuthPasswordResetFormData,
    token: string | null,
  ): Promise<ServiceResult<AuthPasswordResetFormData, boolean>> => {
    if (isEmpty(token)) {
      return [createFieldErrors({ token: "无效的密码重置链接" }), undefined];
    }

    const { errors, values } = await validateData(data, authPasswordResetResolver);

    if (errors) {
      return [errors, undefined];
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
      return [createFieldErrors({ token: "无效的密码重置链接" }), undefined];
    }

    await database
      .update(authTable as AnyPgTable)
      .set({
        password: await hash(values.password),
      })
      .where(eq(authTable.id, resets[0].identityId));

    await database
      .update(authPasswordResetTable as AnyPgTable)
      .set({ redeemed: true })
      .where(eq(authPasswordResetTable.id, resets[0].id));

    return [undefined, true];
  };
};
