import type { HttpBindings } from "@hono/node-server";
import { createRequestHandler, type ServerBuild } from "@remix-run/server-runtime";
import { getClientIp, getRequestOrigin } from "@resolid/remix-utils";
import type { Context } from "hono";
import { env } from "node:process";

export default function remixHandler(build: ServerBuild, c: Context<{ Bindings: HttpBindings }>) {
  const requestHandler = createRequestHandler(build, "production");

  return requestHandler(c.req.raw, {
    remoteAddress: getClientIp(c.req.raw, c.env.incoming.socket, {
      proxy: env.RX_PROXY == 1,
      maxIpsCount: env.RX_PROXY_COUNT,
    }),
    requestOrigin: getRequestOrigin(c.req.raw, c.env.incoming.socket, env.RX_PROXY == 1),
  });
}
