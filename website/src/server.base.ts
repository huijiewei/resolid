import { setup } from "@resolid/framework";
import { getClientIp, getRequestOrigin } from "@resolid/framework/utils.server";
import type { HonoContext, NodeEnv } from "@resolid/react-router-hono";
import { env } from "node:process";
import { RouterContextProvider } from "react-router";

declare module "react-router" {
  interface RouterContextProvider {
    remoteAddress?: string;
    requestOrigin?: string;
  }
}

setup();

export const getLoadContext = (c: HonoContext<NodeEnv>) => {
  const proxy = env.RX_PROXY == 1;

  const context = new RouterContextProvider();

  Object.assign(context, {
    remoteAddress: getClientIp(c.req.raw, c.env.incoming.socket, {
      proxy: proxy,
      proxyCount: env.RX_PROXY_COUNT,
    }),
    requestOrigin: getRequestOrigin(c.req.raw, c.env.incoming.socket, proxy),
  });

  return context;
};
