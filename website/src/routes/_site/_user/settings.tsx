import { mergeMeta } from "@resolid/framework/utils";
import { requireUserIdentity } from "~/modules/user/session.server";
import type { Route } from "./+types/settings";

// noinspection JSUnusedGlobalSymbols
export const loader = async ({ request }: Route.LoaderArgs) => {
  return requireUserIdentity(request);
};
// noinspection JSUnusedGlobalSymbols
export const meta = mergeMeta(() => {
  return [{ title: "用户设置" }];
});

// noinspection JSUnusedGlobalSymbols
export default function Settings({ loaderData }: Route.ComponentProps) {
  return <div>用户设置 {loaderData.username}</div>;
}
