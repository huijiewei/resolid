import { createSessionStorage, type SessionIdStorageStrategy } from "react-router";
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
  return createSessionStorage<AuthSessionData<T>>({
    cookie: cookie,
    async createData(data, expires) {
      const expiredAt = expires ?? getCookieExpires(365);

      return service.createSession(data as AuthSessionData<T>, expiredAt);
    },
    async updateData(id, data, expires) {
      const expiredAt = expires ?? getCookieExpires(365);

      return service.updateSession(id, data as AuthSessionData<T>, expiredAt);
    },
    async readData(id) {
      const identity = await service.getIdentity(id);

      return identity ? { identity: identity } : null;
    },
    async deleteData(id) {
      return service.removeSession(id);
    },
  });
};
