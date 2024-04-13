import { createSessionStorage } from "@remix-run/node";
import type { FlashSessionData, SessionIdStorageStrategy } from "@remix-run/server-runtime";
import type { IntRange } from "type-fest";
import type { AuthSessionData, AuthSessionService } from "../modules/auth/service";

export type DatabaseSessionStorageOptions<T> = {
  cookie?: SessionIdStorageStrategy["cookie"];
  service: AuthSessionService<T>;
};

type DateOption<T extends IntRange<1, 366> | undefined = undefined> = T extends undefined ? undefined : Date;

export const getCookieExpires = <T extends IntRange<1, 366> | undefined>(days?: T): DateOption<T> => {
  return days ? <DateOption<T>>new Date(Date.now() + 1000 * 60 * 60 * 24 * days) : <DateOption<T>>undefined;
};

export const createDatabaseSessionStorage = <T>({ cookie, service }: DatabaseSessionStorageOptions<T>) => {
  return createSessionStorage({
    cookie: cookie,
    async createData(
      data: FlashSessionData<AuthSessionData<T>, AuthSessionData<T>>,
      expires: Date | undefined,
    ): Promise<string> {
      const expiredAt = expires ?? getCookieExpires(365);

      return service.createdSession(data as AuthSessionData<T>, expiredAt);
    },
    async updateData(
      id: string,
      data: FlashSessionData<AuthSessionData<T>, AuthSessionData<T>>,
      expires: Date | undefined,
    ): Promise<void> {
      const expiredAt = expires ?? getCookieExpires(365);

      return service.updateSession(id, data as AuthSessionData<T>, expiredAt);
    },
    async readData(id: string): Promise<FlashSessionData<AuthSessionData<T>, AuthSessionData<T>> | null> {
      const identity = await service.getIdentity(id);

      return identity ? { identity: identity } : null;
    },
    async deleteData(id: string): Promise<void> {
      return service.removeSession(id);
    },
  });
};
