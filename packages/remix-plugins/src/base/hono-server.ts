import { type AppLoadContext, type ServerBuild, createRequestHandler } from "@remix-run/node";
import { type Context, type Env, Hono, type MiddlewareHandler } from "hono";
import type { HonoOptions } from "hono/hono-base";
import type { BlankEnv } from "hono/types";

type ReactRouterMiddlewareOptions = {
  build: ServerBuild;
  mode?: string;
  getLoadContext?(c: Context): Promise<AppLoadContext> | AppLoadContext;
};

const reactRouter =
  ({
    mode,
    build,
    getLoadContext = (c) => c.env as unknown as AppLoadContext,
  }: ReactRouterMiddlewareOptions): MiddlewareHandler =>
  async (c) => {
    const requestHandler = createRequestHandler(build, mode);
    const loadContext = getLoadContext(c);

    return await requestHandler(c.req.raw, loadContext instanceof Promise ? await loadContext : loadContext);
  };

export type HonoServerOptions<E extends Env = BlankEnv> = {
  configure?: <E extends Env = BlankEnv>(server: Hono<E>) => Promise<void> | void;
  getLoadContext?: (
    c: Context,
    options: Pick<ReactRouterMiddlewareOptions, "build" | "mode">,
  ) => Promise<AppLoadContext> | AppLoadContext;
  honoOptions?: HonoOptions<E>;
};

export const createHonoServer = async <E extends Env = BlankEnv>(
  mode: string | undefined,
  build: ServerBuild,
  options: HonoServerOptions<E> = {},
) => {
  const server = new Hono<E>(options.honoOptions);

  if (options.configure) {
    await options.configure(server);
  }

  server.use("*", async (c, next) => {
    return reactRouter({
      build,
      mode,
      getLoadContext(c) {
        if (!options.getLoadContext) {
          return {};
        }

        return options.getLoadContext(c, { build });
      },
    })(c, next);
  });

  return server;
};
