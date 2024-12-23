import { createHonoNodeServer } from "@resolid/react-router-hono/node-server";
import { getLoadContext, honoConfigure } from "~/server.base";

export default await createHonoNodeServer({
  configure: honoConfigure,
  getLoadContext: getLoadContext,
});
