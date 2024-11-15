import { createHonoNodeServer } from "@resolid/remix-plugins/node-server";
import { getLoadContext, honoConfigure } from "~/server.base";

export const server = await createHonoNodeServer({
  configure: honoConfigure,
  getLoadContext: getLoadContext,
});
