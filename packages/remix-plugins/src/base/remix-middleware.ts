import type { ServerBuild } from "@remix-run/node";
import type { MiddlewareHandler } from "hono";

// @ts-expect-error Cannot find module
import remixHandler from "~resolid-remix/handler";

export const remix = (build: ServerBuild): MiddlewareHandler => {
  return async (c) => {
    return remixHandler(build, c);
  };
};
