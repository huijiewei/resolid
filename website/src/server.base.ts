import type { HttpBindings } from "@hono/node-server";
import { getClientIp, getRequestOrigin } from "@resolid/framework/utils.server";
import type { Context } from "hono";
import { env } from "node:process";
import { unstable_createContext, unstable_RouterContextProvider } from "react-router";

export const reqContext = unstable_createContext<{ remoteAddress: string; requestOrigin: string }>();

export const getLoadContext = (c: Context<{ Bindings: HttpBindings }>) => {
  const proxy = env.RX_PROXY == 1;

  const context = new unstable_RouterContextProvider();

  context.set(reqContext, {
    remoteAddress: getClientIp(c.req.raw, c.env.incoming.socket, {
      proxy: proxy,
      proxyCount: env.RX_PROXY_COUNT,
    }),
    requestOrigin: getRequestOrigin(c.req.raw, c.env.incoming.socket, proxy),
  });

  return context;
};
