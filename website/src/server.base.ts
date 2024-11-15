import { env } from "node:process";
import type { HttpBindings } from "@hono/node-server";
import { getClientIp, getRequestOrigin } from "@resolid/framework/utils.server";
import { randomId } from "@resolid/utils";
import type { Context, Env, Hono } from "hono";
import { requestId } from "hono/request-id";
import type { BlankEnv } from "hono/types";

export const getLoadContext = (c: Context<{ Bindings: HttpBindings }>) => {
  const proxy = env.RX_PROXY == 1;

  return {
    requestId: c.get("requestId"),
    remoteAddress: getClientIp(c.req.raw, c.env.incoming.socket, {
      proxy: proxy,
      proxyCount: env.RX_PROXY_COUNT,
    }),
    requestOrigin: getRequestOrigin(c.req.raw, c.env.incoming.socket, proxy),
  };
};

export const honoConfigure = <E extends Env = BlankEnv>(server: Hono<E>) => {
  server.use(
    "*",
    requestId({
      generator: () => {
        return randomId();
      },
    }),
  );
};
