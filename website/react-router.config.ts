import type { Config } from "@react-router/dev/config";
import { netlifyPreset } from "@resolid/react-router-hono/netlify-preset";
import { nodePreset } from "@resolid/react-router-hono/node-preset";
import { vercelPreset } from "@resolid/react-router-hono/vercel-preset";
import { env } from "node:process";

// noinspection JSUnusedGlobalSymbols
export default {
  appDirectory: "src",
  ssr: true,
  presets: [
    env.NETLIFY
      ? netlifyPreset({
          entryFile: "server.netlify.ts",
          nodeVersion: 22,
          copyParentModules: ["@node-rs/bcrypt"],
        })
      : env.VERCEL
        ? vercelPreset({
            regions: ["sin1"],
            entryFile: "server.vercel.ts",
            nodeVersion: 22,
            copyParentModules: ["@node-rs/bcrypt"],
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
    v8_middleware: true,
    unstable_optimizeDeps: true,
    unstable_splitRouteModules: true,
    unstable_viteEnvironmentApi: true,
  },
} satisfies Config;
