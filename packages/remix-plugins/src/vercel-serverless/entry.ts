import { handle } from "@hono/node-server/vercel";
import { Hono } from "hono";
import { remix } from "../base/remix-middleware";

// @ts-expect-error Cannot find module
import * as build from "./index.js";

const app = new Hono();

app.use("*", remix(build));

export default handle(app);
