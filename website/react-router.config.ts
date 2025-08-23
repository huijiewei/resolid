import type { Config } from "@react-router/dev/config";
import { nodePreset } from "@resolid/react-router-hono/node-preset";
import { vercelPreset } from "@resolid/react-router-hono/vercel-preset";
import { env } from "node:process";

// noinspection JSUnusedGlobalSymbols
export default {
  appDirectory: "src",
  ssr: true,
  presets: [
    env.VERCEL == "1"
      ? vercelPreset({
          regions: ["sin1"],
          copyParentModules: ["@node-rs/bcrypt"],
          entryFile: "server.vercel.ts",
          nodeVersion: 22,
        })
      : nodePreset({
          entryFile: "server.node.ts",
          nodeVersion: 22,
        }),
  ],
  serverBundles: ({ branch }) => {
    return branch.some((route) => {
      return route.id.startsWith("routes/admin");
    })
      ? "admin"
      : "site";
  },
  future: {
    unstable_middleware: true,
    unstable_optimizeDeps: true,
    unstable_splitRouteModules: true,
    unstable_viteEnvironmentApi: true,
  },
} satisfies Config;
