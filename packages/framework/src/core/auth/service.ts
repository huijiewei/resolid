export type AuthSessionData<T> = {
  identity: T;
  remoteAddr: string;
  userAgent: string;
};

export type AuthSessionService<T> = {
  getIdentity: (sessionId: string) => Promise<T | undefined>;
  createdSession: (sessionData: AuthSessionData<T>, expiredAt: Date) => Promise<string>;
  updateSession: (sessionId: string, sessionData: AuthSessionData<T>, expiredAt: Date) => Promise<void>;
  removeSession: (sessionId: string) => Promise<void>;
};
