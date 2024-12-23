import { authUtils } from "@resolid/framework/modules";
import { mergeMeta } from "@resolid/framework/utils";
import { httpNotFound } from "@resolid/framework/utils.server";
import { useLoaderData } from "react-router";
import { userServices } from "~/modules/user/service.server";
import type { Route } from "./+types/user.$name";

export const loader = async ({ params }: Route.LoaderArgs) => {
  const user = await userServices.getByUsername(params.name!);

  if (!user) {
    httpNotFound("用户不存在");
  }

  return user;
};

// noinspection JSUnusedGlobalSymbols
export const meta = mergeMeta(({ data }: Route.MetaArgs) => {
  return [
    {
      title: data ? authUtils.getDisplayName(data) : "用户不存在",
    },
  ];
});

// noinspection JSUnusedGlobalSymbols
export default function UserPage() {
  const user = useLoaderData<typeof loader>();

  return <div>{authUtils.getDisplayName(user!)}</div>;
}
