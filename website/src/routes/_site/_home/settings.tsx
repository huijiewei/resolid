import type { LoaderFunctionArgs } from "@remix-run/node";
import { mergeMeta, useTypedLoaderData } from "@resolid/remix-utils";
import { requireSessionUser } from "~/foundation/session.server";

export const meta = mergeMeta(() => {
  return [{ title: "用户设置" }];
});

export const loader = async ({ request, response }: LoaderFunctionArgs) => {
  return requireSessionUser(request, response!);
};

export default function Settings() {
  const user = useTypedLoaderData<typeof loader>();

  return <div className={"mx-auto max-w-6xl p-4"}>用户设置 {user.username}</div>;
}
