import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authUtils } from "@resolid/framework/modules";
import { mergeMeta } from "@resolid/framework/utils";
import { httpNotFound } from "@resolid/framework/utils.server";
import { userServices } from "~/modules/user/service.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const user = await userServices.getByUsername(params.name!);

  if (!user) {
    httpNotFound("用户不存在");
  }

  return user!;
};

export const meta = mergeMeta<typeof loader>(({ data }) => {
  return [{ title: data ? authUtils.getDisplayName(data) : "用户不存在" }];
});

export default function UserPage() {
  const user = useLoaderData<typeof loader>();

  return <div>{authUtils.getDisplayName(user)}</div>;
}
