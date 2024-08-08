import { unstable_defineLoader } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { mergeMeta } from "@resolid/framework/utils";
import { requireSessionUser } from "~/foundation/session.user.server";

export const meta = mergeMeta(() => {
  return [{ title: "用户设置" }];
});

export const loader = unstable_defineLoader(async ({ request }) => {
  return requireSessionUser(request);
});

export default function Settings() {
  const user = useLoaderData<typeof loader>();

  return <div>用户设置 {user.username}</div>;
}
