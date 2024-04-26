import { env } from "node:process";
import { createDatabaseSessionStorage } from "@resolid/framework";
import type { AdminIdentity } from "~/modules/admin/schema.server";
import { adminSessionService } from "~/modules/admin/service.server";

const {
  getSession: getAdminSession,
  commitSession: commitAdminSession,
  destroySession: destroyAdminSession,
} = createDatabaseSessionStorage<AdminIdentity>({
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

export const getSessionAdmin = async (request: Request) => {
  const session = await getAdminSession(request.headers.get("Cookie"));

  return session.has("identity") ? session.data.identity : undefined;
};

export const setSessionAdmin = async (request: Request, admin: AdminIdentity, remoteAddr: string) => {
  const session = await getAdminSession(request.headers.get("Cookie"));

  session.set("identity", admin);
  session.set("remoteAddr", remoteAddr);
  session.set("userAgent", request.headers.get("user-agent") ?? "");

  return session;
};

export { commitAdminSession, destroyAdminSession, getAdminSession };
