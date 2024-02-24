import { createRequestHandler, type ServerBuild } from "@remix-run/server-runtime";
import type { Context } from "hono";

export default function remixHandler(build: ServerBuild, c: Context) {
  const requestHandler = createRequestHandler(build, "production");

  const remoteAddress = c.req.header("x-vercel-deployment-url")
    ? c.req.header("x-forwarded-for")
    : c.env.incoming.socket.remoteAddress;

  return requestHandler(c.req.raw, {
    remoteAddress: remoteAddress,
  });
}
