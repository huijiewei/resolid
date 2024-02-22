import { createRequestHandler, type ServerBuild } from "@remix-run/server-runtime";
import type { MiddlewareHandler } from "hono";

export const remix = (build: ServerBuild): MiddlewareHandler => {
  return async (c) => {
    const requestHandler = createRequestHandler(build, "production");

    return requestHandler(c.req.raw);
  };
};
