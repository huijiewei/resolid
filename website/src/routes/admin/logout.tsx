import type { ActionFunctionArgs } from "@remix-run/node";
import { httpRedirect } from "@resolid/framework/utils";
import { destroyAdminSession, getAdminSession } from "~/foundation/session.admin.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getAdminSession(request.headers.get("Cookie"));

  httpRedirect(new URL(request.url).searchParams.get("redirect") ?? "", await destroyAdminSession(session));
};
