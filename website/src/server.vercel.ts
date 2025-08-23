import { createHonoVercelServer } from "@resolid/react-router-hono/vercel-server";
import { getLoadContext } from "~/server.base";

// noinspection JSUnusedGlobalSymbols
export default await createHonoVercelServer({
  getLoadContext: getLoadContext,
});
