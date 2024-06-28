import { type TypedActionArgs, httpRedirect } from "@resolid/framework/utils";
import { destroyAdminSession, getAdminSession } from "~/foundation/session.admin.server";

export const action = async ({ request, response }: TypedActionArgs) => {
  const session = await getAdminSession(request.headers.get("Cookie"));

  httpRedirect(response, new URL(request.url).searchParams.get("redirect") ?? "", await destroyAdminSession(session));
};
