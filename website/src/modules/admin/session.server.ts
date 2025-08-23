import { createDatabaseSessionStorage, getCookieExpires } from "@resolid/framework";
import { env } from "node:process";
import type { AdminIdentity } from "~/modules/admin/schema.server";
import { adminSessionService } from "~/modules/admin/service.server";

const { getSession, commitSession, destroySession } = createDatabaseSessionStorage<AdminIdentity>({
  cookie: {
    name: "__sa",
    httpOnly: true,
    sameSite: "lax",
    secrets: [env.RX_COOKIE_SECRET],
    secure: env.NODE_ENV == "production",
    path: "/admin",
  },
  service: adminSessionService,
});

export const getAdminIdentity = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));

  return session.has("identity") ? session.data.identity : undefined;
};

export const commitAdminSession = async (
  request: Request,
  admin: AdminIdentity,
  remoteAddr: string,
  rememberMe: boolean,
) => {
  const session = await getSession(request.headers.get("Cookie"));

  session.set("identity", admin);
  session.set("remoteAddr", remoteAddr);
  session.set("userAgent", request.headers.get("user-agent") ?? "");

  return commitSession(session, {
    expires: getCookieExpires(rememberMe ? 365 : undefined),
  });
};

export const destroyAdminSession = async (request: Request) => {
  return await destroySession(await getSession(request.headers.get("Cookie")));
};
