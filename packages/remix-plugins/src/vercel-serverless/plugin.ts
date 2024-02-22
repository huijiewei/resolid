import { nodeFileTrace } from "@vercel/nft";
import { cp, mkdir, readdir, realpath, rm, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { cwd } from "node:process";
import { fileURLToPath } from "node:url";
import type { ConfigEnv, Plugin, RollupCommonJSOptions, UserConfig } from "vite";
import { bundleServer, type SsrExternal } from "../base/build-utils";

export type VercelServerlessBuildOptions = {
  regions: string | string[];
  cleanUrls?: boolean;
  cacheFiles?: string[];
  cacheFolders?: string[];
};

const vercelServerlessBuild = (options: VercelServerlessBuildOptions): Plugin => {
  const __dirname = fileURLToPath(new URL(".", import.meta.url));

  let root = "";
  let outDir = "";
  let ssrExternal: SsrExternal;
  let commonjsOptions: RollupCommonJSOptions;

  const cacheFiles = options.cacheFiles ?? [];
  const cacheFolders = options.cacheFolders ?? [];

  return {
    name: "vite-plugin-remix-vercel-serverless",
    apply(config: UserConfig, { command }: ConfigEnv) {
      return command === "build" && !!config.build?.ssr;
    },
    enforce: "post",
    async configResolved(config) {
      root = config.root || cwd();
      outDir = config.build.outDir;
      ssrExternal = config.ssr.external;
      commonjsOptions = config.build.commonjsOptions;
    },
    async closeBundle() {
      console.log("bundle Vercel Serverless for production...");

      const entryFile = "vercel-serverless-entry.js";

      await cp(join(__dirname, entryFile), join(outDir, entryFile));

      /*
      * # .vercel/
        #   project.json
        #   output/
        #     config.json
        #     static/              = build/client
        #     functions/
        #       _serverless.func/
        #         .vc-config.json
        #         index.mjs         = entry.ts
      * */

      const vercelRoot = join(root, ".vercel");
      await rm(vercelRoot, { recursive: true, force: true });
      await mkdir(vercelRoot, { recursive: true });

      const bundleFile = await bundleServer(
        outDir,
        entryFile,
        join(root, "package.json"),
        commonjsOptions,
        ssrExternal,
      );

      await cp(join(outDir, "package.json"), join(vercelRoot, "package.json"));

      const vercelOutput = join(vercelRoot, "output");
      await mkdir(vercelOutput, { recursive: true });

      const configJson: { version: number; routes: unknown[] } = {
        version: 3,
        routes: [],
      };

      if (options.cleanUrls) {
        configJson.routes.push({ src: "^/(.*)/$", headers: { Location: "/$1" }, status: 308 });
      }

      configJson.routes.push({
        src: `^/(${["favicon.ico", ...cacheFiles]
          .filter((f) => f.length > 0)
          .map((f) => f.replace(".", "\\."))
          .join("|")})$`,
        headers: {
          "cache-control": "public, max-age=86400",
        },
        continue: true,
      });

      configJson.routes.push({
        src: `^/(${["assets", ...cacheFolders].filter((f) => f.length > 0).join("|")})/(.*)$`,
        headers: {
          "cache-control": "public, max-age=31536000, immutable",
        },
        continue: true,
      });

      configJson.routes.push({
        handle: "filesystem",
      });

      configJson.routes.push({
        src: "/(.*)",
        dest: "_serverless",
      });

      await writeFile(join(vercelOutput, "config.json"), JSON.stringify(configJson, null, 2), "utf8");

      const vercelOutputStatic = join(vercelOutput, "static");
      await mkdir(vercelOutputStatic, { recursive: true });
      await cp(resolve(outDir, "../client"), vercelOutputStatic, { recursive: true });
      await rm(join(vercelOutputStatic, ".vite"), { recursive: true });

      const vercelOutputFunc = join(vercelOutput, "functions", "_serverless.func");
      await mkdir(vercelOutputFunc, { recursive: true });

      const traced = await nodeFileTrace([bundleFile], {
        base: root,
      });

      for (const file of traced.fileList) {
        const source = join(root, file);

        if (source == bundleFile) {
          continue;
        }

        const dest = join(vercelOutputFunc, relative(root, source));
        const real = await realpath(source);

        if (real.endsWith("@node-rs/bcrypt")) {
          const parent = join(real, "..");

          for (const dir of (await readdir(parent)).filter((d) => !d.startsWith("."))) {
            const realPath = await realpath(join(parent, dir));
            const realDest = join(dest, "..", dir);

            await cp(realPath, realDest, { recursive: true });
          }
        } else {
          await cp(real, dest, { recursive: true });
        }
      }

      await writeFile(
        join(vercelOutputFunc, ".vc-config.json"),
        JSON.stringify(
          {
            handler: "index.mjs",
            runtime: "nodejs20.x",
            launcherType: "Nodejs",
            supportsResponseStreaming: true,
            regions: Array.isArray(options.regions) ? options.regions : [options.regions],
          },
          null,
          2,
        ),
        "utf8",
      );

      await cp(bundleFile, join(vercelOutputFunc, "index.mjs"));
    },
  };
};

export default vercelServerlessBuild;
