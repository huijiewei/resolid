import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { mergeMeta } from "@resolid/framework/utils";
import { requireSessionUser } from "~/foundation/session.user.server";

export const meta = mergeMeta(() => {
  return [{ title: "用户设置" }];
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return requireSessionUser(request);
};

export default function Settings() {
  const user = useLoaderData<typeof loader>();

  return <div>用户设置 {user.username}</div>;
}
