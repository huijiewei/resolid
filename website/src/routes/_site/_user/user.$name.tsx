import { authUtils } from "@resolid/framework/modules";
import { type TypedLoaderArgs, httpNotFound, mergeMeta, useTypedLoaderData } from "@resolid/framework/utils";
import { userServices } from "~/modules/user/service.server";

export const loader = async ({ params }: TypedLoaderArgs) => {
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
  const user = useTypedLoaderData<typeof loader>();

  return <div>{authUtils.getDisplayName(user)}</div>;
}
