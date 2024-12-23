import { mergeMeta } from "@resolid/framework/utils";
import { useLoaderData } from "react-router";
import { requireSessionUser } from "~/foundation/session.user.server";
import type { Route } from "./+types/settings";

// noinspection JSUnusedGlobalSymbols
export const meta = mergeMeta(() => {
  return [{ title: "用户设置" }];
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  return requireSessionUser(request);
};

// noinspection JSUnusedGlobalSymbols
export default function Settings() {
  const user = useLoaderData<typeof loader>();

  return <div>用户设置 {user.username}</div>;
}
