import { type TypedActionArgs, httpRedirect } from "@resolid/framework/utils";
import { destroyUserSession, getUserSession } from "~/foundation/session.user.server";

export const action = async ({ request, response }: TypedActionArgs) => {
  const session = await getUserSession(request.headers.get("Cookie"));

  httpRedirect(response, new URL(request.url).searchParams.get("redirect") ?? "", await destroyUserSession(session));
};
