import { httpRedirect } from "@resolid/framework/utils.server";
import { destroyUserSession, getUserSession } from "~/foundation/session.user.server";
import type { Route } from "./+types/logout";

// noinspection JSUnusedGlobalSymbols
export const action = async ({ request }: Route.ActionArgs) => {
  const session = await getUserSession(request.headers.get("Cookie"));

  httpRedirect(new URL(request.url).searchParams.get("redirect") ?? "", await destroyUserSession(session));
};
