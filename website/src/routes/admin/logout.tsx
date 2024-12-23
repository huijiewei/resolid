import { httpRedirect } from "@resolid/framework/utils.server";
import { destroyAdminSession, getAdminSession } from "~/foundation/session.admin.server";
import type { Route } from "./+types/logout";

export const action = async ({ request }: Route.ActionArgs) => {
  const session = await getAdminSession(request.headers.get("Cookie"));

  httpRedirect(new URL(request.url).searchParams.get("redirect") ?? "", await destroyAdminSession(session));
};
