import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { destroyUserSession, getUserSession } from "~/foundation/session.user.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getUserSession(request.headers.get("Cookie"));

  return redirect(new URL(request.url).searchParams.get("redirect") ?? "", {
    headers: {
      "Set-Cookie": await destroyUserSession(session),
    },
  });
};
