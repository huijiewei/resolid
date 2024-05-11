import { type TypedLoaderArgs, mergeMeta, useTypedLoaderData } from "@resolid/framework/utils";
import { requireSessionUser } from "~/foundation/session.user.server";

export const meta = mergeMeta(() => {
  return [{ title: "用户设置" }];
});

export const loader = async ({ request, response }: TypedLoaderArgs) => {
  return requireSessionUser(response, request);
};

export default function Settings() {
  const user = useTypedLoaderData<typeof loader>();

  return <div>用户设置 {user.username}</div>;
}
