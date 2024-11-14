import fs from "node:fs";
import type http from "node:http";
import path from "node:path";
import { getRequestListener } from "@hono/node-server";
import { minimatch } from "minimatch";
import type { Connect, ViteDevServer, Plugin as VitePlugin } from "vite";

type Fetch = (
  request: Request,
  env: { incoming: http.IncomingMessage; outgoing: http.ServerResponse },
) => Promise<Response>;

type LoadModule = (server: ViteDevServer, entry: string) => Promise<{ fetch: Fetch }>;

export type DevServerOptions = {
  entry?: string;
  export?: string;
  exclude?: (string | RegExp)[];
};

export const defaultOptions: Required<DevServerOptions> = {
  entry: "./src/index.ts",
  export: "default",
  exclude: [],
};

export const honoDevServer = (options?: DevServerOptions): VitePlugin => {
  let publicDirPath = "";
  const entry = options?.entry ?? defaultOptions.entry;

  return {
    name: "@hono/vite-dev-server",
    configResolved(config) {
      publicDirPath = config.publicDir;
    },
    configureServer: async (server) => {
      async function createMiddleware(server: ViteDevServer): Promise<Connect.HandleFunction> {
        return async (
          req: http.IncomingMessage,
          res: http.ServerResponse,
          next: Connect.NextFunction,
        ): Promise<void> => {
          if (req.url) {
            const filePath = path.join(publicDirPath, req.url);

            try {
              if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                return next();
              }
            } catch {}
          }

          const exclude = options?.exclude ?? defaultOptions.exclude;

          for (const pattern of exclude) {
            if (req.url) {
              if (pattern instanceof RegExp) {
                if (pattern.test(req.url)) {
                  return next();
                }
              } else if (minimatch(req.url?.toString(), pattern)) {
                return next();
              }
            }
          }

          const loadModule: LoadModule = async (server, entry) => {
            const appModule = await server.ssrLoadModule(entry);
            const exportName = options?.export ?? defaultOptions.export;
            const app = appModule[exportName] as { fetch: Fetch };
            if (!app) {
              throw new Error(`Failed to find a named export "${exportName}" from ${entry}`);
            }
            return app;
          };

          let app: { fetch: Fetch };

          try {
            app = await loadModule(server, entry);
          } catch (e) {
            return next(e);
          }

          await getRequestListener(
            async (request) => {
              const response = await app.fetch(request, { incoming: req, outgoing: res });

              if (!(response instanceof Response)) {
                throw response;
              }

              return response;
            },
            {
              overrideGlobalObjects: false,
              errorHandler: (e) => {
                let err: Error;
                if (e instanceof Error) {
                  err = e;
                  server.ssrFixStacktrace(err);
                } else if (typeof e === "string") {
                  err = new Error(`The response is not an instance of "Response", but: ${e}`);
                } else {
                  err = new Error(`Unknown error: ${e}`);
                }

                next(err);
              },
            },
          )(req, res);
        };
      }

      server.middlewares.use(await createMiddleware(server));
    },
  };
};
