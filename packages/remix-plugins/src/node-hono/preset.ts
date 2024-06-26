import { rm } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import type { Preset } from "@remix-run/dev";
import { buildEntry } from "../base/build-utils";

export const nodeHonoPreset = (): Preset => {
  const __dirname = fileURLToPath(new URL(".", import.meta.url));

  return {
    name: "resolid-node-hono-preset",
    remixConfig: () => {
      return {
        buildEnd: async ({ buildManifest, remixConfig, viteConfig }) => {
          const rootPath = viteConfig.root;
          const appPath = remixConfig.appDirectory;
          const serverBuildFile = remixConfig.serverBuildFile;
          const serverBuildPath = join(remixConfig.buildDirectory, "server");

          const ssrExternal = viteConfig.ssr.external;

          const serverBundles = buildManifest?.serverBundles ?? {
            site: { id: "site", file: relative(rootPath, join(serverBuildPath, serverBuildFile)) },
          };

          console.log("Bundle Node Hono Server for production...");

          for (const key in serverBundles) {
            const serverBundleId = serverBundles[key].id;
            const buildFile = join(rootPath, serverBundles[key].file);
            const buildPath = dirname(buildFile);

            const [, defaultHandler] = await buildEntry(
              appPath,
              join(__dirname, "node-hono-entry.js"),
              buildPath,
              buildFile,
              serverBundleId,
              join(rootPath, "package.json"),
              ssrExternal,
            );

            if (defaultHandler) {
              await rm(defaultHandler, { force: true });
            }
          }
        },
      };
    },
  };
};
