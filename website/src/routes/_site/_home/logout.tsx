import type { ActionFunctionArgs } from "@remix-run/node";
import { httpRedirect } from "@resolid/framework/utils";
import { destroyUserSession, getUserSession } from "~/foundation/session.user.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getUserSession(request.headers.get("Cookie"));

  httpRedirect(new URL(request.url).searchParams.get("redirect") ?? "", await destroyUserSession(session));
};
