import { createHonoVercelServer } from "@resolid/remix-plugins/vercel-server";
import { getLoadContext } from "~/server.base";

export const server = await createHonoVercelServer({
  getLoadContext: getLoadContext,
});

export default server;
