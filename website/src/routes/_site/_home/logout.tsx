import type { ActionFunctionArgs } from "@remix-run/server-runtime";
import { responseRedirect } from "@resolid/remix-utils";
import { destroyUserSession, getUserSession } from "../../../foundation/session.server";

export const loader = async ({ request, response }: ActionFunctionArgs) => {
  const session = await getUserSession(request.headers.get("Cookie"));

  response!.headers.set("Set-Cookie", await destroyUserSession(session));

  return responseRedirect(response!, new URL(request.url).searchParams.get("redirect") ?? "/");
};

export default function Logout() {
  return null;
}
