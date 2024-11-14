import { env } from "node:process";
import { handle } from "@hono/node-server/vercel";
import type { ServerBuild } from "@remix-run/node";
import type { Env } from "hono";
import type { BlankEnv } from "hono/types";
import { importDevBuild } from "../base/dev-build";
import { type HonoServerOptions, createHonoServer } from "../base/hono-server";

export type HonoVercelServerOptions<E extends Env = BlankEnv> = HonoServerOptions<E>;

// noinspection JSUnusedGlobalSymbols
export const createHonoVercelServer = async <E extends Env = BlankEnv>(options: HonoVercelServerOptions<E> = {}) => {
  const mode = env.NODE_ENV == "test" ? "development" : env.NODE_ENV;
  const isProduction = mode == "production";

  const build = isProduction
    ? // @ts-expect-error it's not typed
      ((await import("virtual:remix/server-build")) as ServerBuild)
    : ((await importDevBuild()) as ServerBuild);

  const server = await createHonoServer(mode, build, {
    configure: options.configure,
    getLoadContext: options.getLoadContext,
    honoOptions: options.honoOptions,
  });

  return handle(server);
};
