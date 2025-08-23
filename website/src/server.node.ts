import { createHonoNodeServer } from "@resolid/react-router-hono/node-server";
import { env } from "node:process";
import { getLoadContext } from "~/server.base";

// noinspection JSUnusedGlobalSymbols
export default await createHonoNodeServer({
  port: env.SERVER_PORT,
  getLoadContext: getLoadContext,
});
