import type { HttpBindings } from "@hono/node-server";
import { createRequestHandler, type ServerBuild } from "@remix-run/node";
import { getClientIp, getRequestOrigin } from "@resolid/framework/utils";
import type { Context } from "hono";
import { env } from "node:process";

export default function remixHandler(build: ServerBuild, c: Context<{ Bindings: HttpBindings }>) {
  const requestHandler = createRequestHandler(build, "production");

  const proxy = env.RX_PROXY == 1;

  return requestHandler(c.req.raw, {
    remoteAddress: getClientIp(c.req.raw, c.env.incoming.socket, {
      proxy: proxy,
      proxyCount: env.RX_PROXY_COUNT,
    }),
    requestOrigin: getRequestOrigin(c.req.raw, c.env.incoming.socket, proxy),
  });
}
