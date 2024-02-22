import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono, type MiddlewareHandler } from "hono";
import { networkInterfaces } from "node:os";
import { env } from "node:process";
import { remix } from "../base/remix-middleware";

// @ts-expect-error Cannot find module
import * as build from "./index.js";

const cache = (seconds: number, immutable = false): MiddlewareHandler => {
  return async (c, next) => {
    await next();

    if (!c.res.ok) {
      return;
    }

    c.res.headers.set("cache-control", `public, max-age=${seconds}${immutable ? ", immutable" : ""}`);
  };
};

const app = new Hono();

app
  .use("/assets/*", cache(60 * 60 * 24 * 365, true), serveStatic({ root: build.assetsBuildDirectory }))
  .use("*", cache(60 * 60), serveStatic({ root: build.assetsBuildDirectory }))
  .use("*", remix(build));

serve(
  {
    ...app,
    port: Number(env.PORT) || 3000,
  },
  async (info) => {
    console.log(`🚀 Hono Server started on port ${info.port}`);

    const address =
      env.HOST ||
      Object.values(networkInterfaces())
        .flat()
        .find((ip) => String(ip?.family).includes("4") && !ip?.internal)?.address;

    if (!address) {
      console.log(`[remix-hono-server] http://localhost:${info.port}`);
    } else {
      console.log(`[remix-hono-server] http://localhost:${info.port} (http://${address}:${info.port})`);
    }
  },
);
