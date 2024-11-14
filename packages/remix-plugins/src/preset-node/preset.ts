import { dirname, join, relative } from "node:path";
import type { Preset } from "@remix-run/dev";
import { buildEntry } from "../base/build-utils";

export type NodePresetOptions = {
  entryFile?: string;
};

// noinspection JSUnusedGlobalSymbols
export const nodePreset = (options?: NodePresetOptions): Preset => {
  // noinspection JSUnusedGlobalSymbols
  return {
    name: "resolid-node-preset",
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

          for (const key in serverBundles) {
            const serverBundleId = serverBundles[key].id;
            const buildFile = join(rootPath, serverBundles[key].file);
            const buildPath = dirname(buildFile);

            await buildEntry(
              appPath,
              options?.entryFile ?? "server.ts",
              buildPath,
              buildFile,
              serverBundleId,
              join(rootPath, "package.json"),
              ssrExternal,
            );
          }
        },
      };
    },
  };
};
