import type { Preset } from "@remix-run/dev";
import { rm } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { buildEntry, bundleServer } from "../base/build-utils";

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
          const commonjsOptions = viteConfig.build.commonjsOptions;

          const serverBundles = buildManifest?.serverBundles ?? {
            site: { id: "site", file: relative(rootPath, join(serverBuildPath, serverBuildFile)) },
          };

          console.log("bundle Node Hono Server for production...");

          for (const key in serverBundles) {
            const buildFile = join(rootPath, serverBundles[key].file);
            const buildPath = dirname(buildFile);

            const [entryFile, defaultHandler] = await buildEntry(
              appPath,
              join(__dirname, "node-hono-entry.js"),
              buildPath,
              buildFile,
            );

            await bundleServer(buildPath, entryFile, join(rootPath, "package.json"), commonjsOptions, ssrExternal);

            if (defaultHandler) {
              await rm(defaultHandler, { force: true });
            }
          }
        },
      };
    },
  };
};
