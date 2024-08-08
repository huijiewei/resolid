import { unstable_defineLoader } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authUtils } from "@resolid/framework/modules";
import { httpNotFound, mergeMeta } from "@resolid/framework/utils";
import { userServices } from "~/modules/user/service.server";

export const loader = unstable_defineLoader(async ({ params }) => {
  const user = await userServices.getByUsername(params.name!);

  if (!user) {
    httpNotFound("用户不存在");
  }

  return user!;
});

export const meta = mergeMeta<typeof loader>(({ data }) => {
  return [{ title: data ? authUtils.getDisplayName(data) : "用户不存在" }];
});

export default function UserPage() {
  const user = useLoaderData<typeof loader>();

  return <div>{authUtils.getDisplayName(user)}</div>;
}
