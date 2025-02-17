import { createHonoNodeServer } from "@resolid/react-router-hono/node-server";
import { getLoadContext } from "~/server.base";

export default await createHonoNodeServer({
  getLoadContext: getLoadContext,
});
