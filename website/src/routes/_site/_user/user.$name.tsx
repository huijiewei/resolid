import type { LoaderFunctionArgs } from "@remix-run/node";
import { authUtils } from "@resolid/framework/modules";
import { httpNotFound, mergeMeta, useTypedLoaderData } from "@resolid/framework/utils";
import { userServices } from "~/modules/user/service.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const user = await userServices.getByUsername(params.name!);

  if (!user) {
    throw httpNotFound("用户不存在");
  }

  return user;
};

export const meta = mergeMeta<typeof loader>(({ data }) => {
  return [{ title: data ? authUtils.getDisplayName(data) : "用户不存在" }];
});

export default function UserPage() {
  const user = useTypedLoaderData<typeof loader>();

  return <div>{authUtils.getDisplayName(user)}</div>;
}
