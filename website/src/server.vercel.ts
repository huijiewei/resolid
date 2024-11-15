import { createHonoVercelServer } from "@resolid/remix-plugins/vercel-server";
import { getLoadContext, honoConfigure } from "~/server.base";

export const server = await createHonoVercelServer({
  configure: honoConfigure,
  getLoadContext: getLoadContext,
});

export default server;
