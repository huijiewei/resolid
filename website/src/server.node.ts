import { createHonoNodeServer } from "@resolid/remix-plugins/node-server";
import { getLoadContext } from "~/server.base";

export const server = await createHonoNodeServer({
  getLoadContext: getLoadContext,
});
