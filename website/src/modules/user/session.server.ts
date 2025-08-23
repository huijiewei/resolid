import { createDatabaseSessionStorage, getCookieExpires } from "@resolid/framework";
import { httpRedirect } from "@resolid/framework/utils.server";
import { env } from "node:process";
import { createPath } from "react-router";
import type { UserIdentity } from "~/modules/user/schema.server";
import { userSessionService } from "~/modules/user/service.server";

const { getSession, commitSession, destroySession } = createDatabaseSessionStorage<UserIdentity>({
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

export const getUserIdentity = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));

  return session.has("identity") ? session.data.identity : undefined;
};

export const requireUserIdentity = async (request: Request) => {
  const user = await getUserIdentity(request);

  if (!user) {
    httpRedirect(`/login?redirect=${encodeURIComponent(createPath(new URL(request.url)))}`);
  }

  return user!;
};

export const commitUserSession = async (
  request: Request,
  identity: UserIdentity,
  remoteAddr: string,
  rememberMe: boolean,
) => {
  const session = await getSession(request.headers.get("Cookie"));

  session.set("identity", identity);
  session.set("remoteAddr", remoteAddr);
  session.set("userAgent", request.headers.get("user-agent") ?? "");

  return await commitSession(session, { expires: getCookieExpires(rememberMe ? 365 : undefined) });
};

export const destroyUserSession = async (request: Request) => {
  return await destroySession(await getSession(request.headers.get("Cookie")));
};
