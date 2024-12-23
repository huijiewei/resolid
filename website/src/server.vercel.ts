import { createHonoVercelServer } from "@resolid/react-router-hono/vercel-server";
import { getLoadContext, honoConfigure } from "~/server.base";

export default await createHonoVercelServer({
  configure: honoConfigure,
  getLoadContext: getLoadContext,
});
