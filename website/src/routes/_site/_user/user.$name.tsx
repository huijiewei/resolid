import { authUtils } from "@resolid/framework/modules";
import { mergeMeta } from "@resolid/framework/utils";
import { httpNotFound } from "@resolid/framework/utils.server";
import { userService } from "~/modules/user/service.server";
import type { Route } from "./+types/user.$name";

// noinspection JSUnusedGlobalSymbols
export const loader = async ({ params }: Route.LoaderArgs) => {
  const user = await userService.getByUsername(params.name!);

  if (!user) {
    httpNotFound("用户不存在");
  }

  return user;
};

// noinspection JSUnusedGlobalSymbols
export const meta = mergeMeta(({ loaderData }: Route.MetaArgs) => {
  return [
    {
      title: loaderData ? authUtils.getDisplayName(loaderData) : "用户不存在",
    },
  ];
});

// noinspection JSUnusedGlobalSymbols
export default function UserPage({ loaderData }: Route.ComponentProps) {
  return <div>{authUtils.getDisplayName(loaderData!)}</div>;
}
