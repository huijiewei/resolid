import { vitePlugin as remix } from "@remix-run/dev";
import remixFlexRoutes from "@resolid/remix-plugins/flex-routes";
import nodeHonoBuild from "@resolid/remix-plugins/node-hono";
import vercelServerlessBuild from "@resolid/remix-plugins/vercel-serverless";
import { join } from "node:path";
import { env } from "node:process";
import { fileURLToPath } from "node:url";
import { defineConfig, splitVendorChunkPlugin, type AliasOptions, type UserConfig } from "vite";
import viteInspect from "vite-plugin-inspect";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command }) => {
  const isBuild = command == "build";
  const buildEnv = env.BUILD_ENV;

  const __dirname = fileURLToPath(new URL(".", import.meta.url));
  const appDirectory = "src";

  const config: UserConfig = {
    plugins: [
      remix({
        appDirectory: appDirectory,
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
        },
        ignoredRouteFiles: ["**/*"],
        routes: async () => {
          return await remixFlexRoutes({
            appDir: appDirectory,
            ignoredRouteFiles: ["**/.*", "**/__*.*", "**/*.demo.tsx"],
          });
        },
      }),
      splitVendorChunkPlugin(),
      !isBuild && tsconfigPaths(),
      !isBuild && viteInspect(),
      isBuild && !buildEnv && nodeHonoBuild({ appDir: appDirectory }),
      isBuild &&
        buildEnv == "vercel" &&
        vercelServerlessBuild({
          appDir: appDirectory,
          regions: "sin1",
          cleanUrls: true,
          cacheFiles: ["favicon.svg", "apple-touch-icon.png", "manifest.webmanifest"],
          cacheFolders: ["icons", "images"],
        }),
    ].filter(Boolean),
    build: {
      minify: true,
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          if (warning.code === "MODULE_LEVEL_DIRECTIVE" && warning.message.includes("use client")) {
            return;
          }
          defaultHandler(warning);
        },
        output: {
          manualChunks(id) {
            if (id.includes("/src/components/base/")) {
              return "components";
            }

            if (
              id.includes("/node_modules/react/") ||
              id.includes("/node_modules/react-dom/") ||
              id.includes("/node_modules/react-is/") ||
              id.includes("/node_modules/scheduler/") ||
              id.includes("/node_modules/prop-types/") ||
              id.includes("/node_modules/loose-envify/")
            ) {
              return "react";
            }

            if (id.includes("/node_modules/@resolid/") || id.includes("/packages/")) {
              return "resolid";
            }

            if (id.includes("/node_modules/")) {
              return "vendor";
            }
          },
        },
      },
    },
    resolve: {
      alias: [
        {
          find: "@dbInstance",
          replacement: join(__dirname, `./${appDirectory}/foundation/db.server.ts`),
        },
        isBuild && { find: "~", replacement: join(__dirname, `./${appDirectory}`) },
      ].filter(Boolean) as AliasOptions,
    },
    optimizeDeps: {
      holdUntilCrawlEnd: false,
    },
  };

  return config;
});
