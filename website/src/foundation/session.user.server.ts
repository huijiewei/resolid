import { createDatabaseSessionStorage } from "@resolid/framework";
import { httpRedirect } from "@resolid/framework/utils.server";
import { env } from "node:process";
import { createPath } from "react-router";
import type { UserIdentity } from "~/modules/user/schema.server";
import { userSessionService } from "~/modules/user/service.server";

const {
  getSession: getUserSession,
  commitSession: commitUserSession,
  destroySession: destroyUserSession,
} = createDatabaseSessionStorage<UserIdentity>({
  cookie: {
    name: "__su",
    httpOnly: true,
    sameSite: "lax",
    secrets: [env.RX_COOKIE_SECRET],
    secure: env.NODE_ENV == "production",
    path: "/",
  },
  service: userSessionService,
});

export const getSessionUser = async (request: Request) => {
  const session = await getUserSession(request.headers.get("Cookie"));

  return session.has("identity") ? session.data.identity : undefined;
};

export const requireSessionUser = async (request: Request) => {
  const user = await getSessionUser(request);

  if (!user) {
    httpRedirect(`/login?redirect=${encodeURIComponent(createPath(new URL(request.url)))}`);
  }

  return user!;
};

export const setSessionUser = async (request: Request, user: UserIdentity, remoteAddr: string) => {
  const session = await getUserSession(request.headers.get("Cookie"));

  session.set("identity", user);
  session.set("remoteAddr", remoteAddr);
  session.set("userAgent", request.headers.get("user-agent") ?? "");

  return session;
};

export { commitUserSession, destroyUserSession, getUserSession };
