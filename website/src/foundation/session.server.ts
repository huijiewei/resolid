import { createPath } from "@remix-run/react";
import type { ResponseStub } from "@remix-run/server-runtime/dist/routeModules";
import { createDatabaseSessionStorage } from "@resolid/framework";
import { userSessionService, type UserAuthSession } from "@resolid/framework/modules";
import { responseRedirect } from "@resolid/remix-utils";
import { env } from "node:process";

const {
  getSession: getUserSession,
  commitSession: commitUserSession,
  destroySession: destroyUserSession,
} = createDatabaseSessionStorage({
  cookie: {
    name: "__su",
    httpOnly: true,
    sameSite: "lax",
    secrets: [env.RX_COOKIE_SECRET],
    path: "/",
  },
  service: userSessionService,
});

export const getSessionUser = async (request: Request) => {
  const session = await getUserSession(request.headers.get("Cookie"));

  return session.has("identity") ? session.data.identity : undefined;
};

export const requireSessionUser = async (request: Request, response: ResponseStub) => {
  const user = await getSessionUser(request);

  if (!user) {
    throw responseRedirect(response, "/login?redirect=" + encodeURIComponent(createPath(new URL(request.url))));
  }

  return user;
};

export const setSessionUser = async (request: Request, user: UserAuthSession, remoteAddr: string) => {
  const session = await getUserSession(request.headers.get("Cookie"));

  session.set("identity", user);
  session.set("remoteAddr", remoteAddr);
  session.set("userAgent", request.headers.get("user-agent") ?? "");

  return session;
};

export { commitUserSession, destroyUserSession, getUserSession };
