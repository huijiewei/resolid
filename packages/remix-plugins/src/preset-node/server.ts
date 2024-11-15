import type { AddressInfo } from "node:net";
import { networkInterfaces } from "node:os";
import { env } from "node:process";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import type { ServerBuild } from "@remix-run/node";
import type { Env, MiddlewareHandler } from "hono";
import { logger } from "hono/logger";
import type { BlankEnv } from "hono/types";
import { importDevBuild } from "../base/dev-build";
import { type HonoServerOptions, createHonoServer } from "../base/hono-server";

export { serveStatic };

// noinspection JSUnusedGlobalSymbols
export const cache =
  (seconds: number, immutable = false): MiddlewareHandler =>
  async (c, next) => {
    if (!c.req.path.match(/\.[a-zA-Z0-9]+$/) || c.req.path.endsWith(".data")) {
      return next();
    }

    await next();

    if (!c.res.ok) {
      return;
    }

    c.res.headers.set("cache-control", `public, max-age=${seconds}${immutable ? ", immutable" : ""}`);
  };

export type HonoNodeServerOptions<E extends Env = BlankEnv> = HonoServerOptions<E> & {
  port?: number;
  defaultLogger?: boolean;
  listeningListener?: (info: AddressInfo) => void;
};

// noinspection JSUnusedGlobalSymbols
export const createHonoNodeServer = async <E extends Env = BlankEnv>(options: HonoNodeServerOptions<E> = {}) => {
  const mode = env.NODE_ENV == "test" ? "development" : env.NODE_ENV;
  const isProduction = mode == "production";

  const mergedOptions: HonoNodeServerOptions<E> = {
    ...{
      port: Number(env.SERVER_PORT) || 3000,
      listeningListener: (info) => {
        console.log(`🚀 Server started on port ${info.port}`);

        const address = Object.values(networkInterfaces())
          .flat()
          .find((ip) => String(ip?.family).includes("4") && !ip?.internal)?.address;

        const servePath = env.SERVER_PATH ? env.SERVER_PATH : "";

        console.log(
          `[resolid-hono-server] http://localhost:${info.port}${servePath}${address && ` (http://${address}:${info.port})`}`,
        );
      },
    },
    ...options,
    defaultLogger: options.defaultLogger ?? !isProduction,
  };

  const build = isProduction
    ? // @ts-expect-error it's not typed
      ((await import("virtual:remix/server-build")) as ServerBuild)
    : ((await importDevBuild()) as ServerBuild);

  const server = await createHonoServer(mode, build, {
    configure: async (server) => {
      if (isProduction) {
        server.use("/assets/*", cache(60 * 60 * 24 * 365, true), serveStatic({ root: build.assetsBuildDirectory }));
      }

      server.use(
        "*",
        cache(60 * 60),
        isProduction ? serveStatic({ root: build.assetsBuildDirectory }) : serveStatic({ root: "./public" }),
      );

      if (mergedOptions.defaultLogger) {
        server.use("*", logger());
      }

      await mergedOptions.configure?.(server);
    },
    getLoadContext: mergedOptions.getLoadContext,
    honoOptions: mergedOptions.honoOptions,
  });

  if (isProduction) {
    serve(
      {
        ...server,
        port: mergedOptions.port,
      },
      mergedOptions.listeningListener,
    );
  }

  return server;
};
