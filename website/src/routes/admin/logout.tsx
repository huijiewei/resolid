import { httpRedirect } from "@resolid/framework/utils.server";
import { destroyAdminSession } from "~/modules/admin/session.server";
import type { Route } from "./+types/logout";

// noinspection JSUnusedGlobalSymbols
export const action = async ({ request }: Route.ActionArgs) => {
  httpRedirect(new URL(request.url).searchParams.get("redirect") ?? "", await destroyAdminSession(request));
};
