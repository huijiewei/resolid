import { rm } from "node:fs/promises";
import { join } from "node:path";
import { cwd } from "node:process";
import { fileURLToPath } from "node:url";
import type { Plugin, RollupCommonJSOptions } from "vite";
import { buildEntry, bundleServer, type BuildOptions, type SsrExternal } from "../base/build-utils";

const nodeHonoBuild = (options: BuildOptions = {}): Plugin => {
  const __dirname = fileURLToPath(new URL(".", import.meta.url));

  const appDir = options.appDir || "app";

  let root = "";
  let outDir = "";
  let ssrExternal: SsrExternal;
  let commonjsOptions: RollupCommonJSOptions;

  return {
    name: "vite-plugin-remix-node-hono",
    apply(config, { command }) {
      return command === "build" && !!config.build?.ssr;
    },
    enforce: "post",
    configResolved(config) {
      root = config.root || cwd();
      outDir = config.build.outDir;
      ssrExternal = config.ssr.external;
      commonjsOptions = config.build.commonjsOptions;
    },
    async closeBundle() {
      console.log("bundle Node Hono Server for production...");

      const [entryFile, defaultHandler] = await buildEntry(
        outDir,
        join(__dirname, "node-hono-entry.js"),
        join(root, appDir),
      );

      await bundleServer(outDir, entryFile, join(root, "package.json"), commonjsOptions, ssrExternal);

      if (defaultHandler) {
        await rm(defaultHandler, { force: true });
      }
    },
  };
};

export default nodeHonoBuild;
