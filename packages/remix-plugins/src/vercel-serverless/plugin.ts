import type { RemixPluginContext, ServerBundleBuildConfig } from "@remix-run/dev/dist/vite/plugin";
import { nodeFileTrace } from "@vercel/nft";
import { cp, mkdir, readdir, realpath, rm, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { cwd } from "node:process";
import { fileURLToPath } from "node:url";
import type { ConfigEnv, Plugin, ResolvedConfig, RollupCommonJSOptions, UserConfig } from "vite";
import { buildEntry, bundleServer, type BuildOptions, type SsrExternal } from "../base/build-utils";

type ServerRoute = { path: string; dest: string };

export type VercelServerlessBuildOptions = BuildOptions & {
  regions: string | string[];
  cleanUrls?: boolean;
  cacheFiles?: string[];
  cacheFolders?: string[];
  serverRoutes?: ServerRoute[];
};

const copyStaticFiles = async (outDir: string, vercelOutDir: string) => {
  const vercelStaticDir = join(vercelOutDir, "static");

  await mkdir(vercelStaticDir, { recursive: true });
  await cp(outDir, vercelStaticDir, {
    recursive: true,
  });
  await rm(join(vercelStaticDir, ".vite"), { recursive: true });
};

const copyFunctionsFiles = async (
  root: string,
  vercelOutDir: string,
  bundleFile: string,
  functionName: string,
  functionRegions: string | string[],
  packageFile: string,
) => {
  const vercelFunctionDir = join(vercelOutDir, "functions", `${functionName}.func`);
  await mkdir(vercelFunctionDir, { recursive: true });

  const traced = await nodeFileTrace([bundleFile], {
    base: root,
  });

  for (const file of traced.fileList) {
    const source = join(root, file);

    if (source == bundleFile) {
      continue;
    }

    const dest = join(vercelFunctionDir, relative(root, source));
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
    join(vercelFunctionDir, ".vc-config.json"),
    JSON.stringify(
      {
        handler: "index.mjs",
        runtime: "nodejs20.x",
        launcherType: "Nodejs",
        supportsResponseStreaming: true,
        regions: Array.isArray(functionRegions) ? functionRegions : [functionRegions],
      },
      null,
      2,
    ),
    "utf8",
  );

  await cp(packageFile, join(vercelFunctionDir, "package.json"));

  await cp(bundleFile, join(vercelFunctionDir, "index.mjs"));
};

const initConfigJson = async (
  cleanUrls: boolean | undefined,
  cacheFiles: string[],
  cacheFolders: string[],
  serverRoutes: ServerRoute[],
  vercelConfigFile: string,
) => {
  const configJson: { version: number; routes: unknown[] } = {
    version: 3,
    routes: [],
  };

  if (cleanUrls) {
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

  for (const route of serverRoutes) {
    if (route.path.length > 0) {
      configJson.routes.push({
        src: `^/${route.path.endsWith("/") ? route.path.substring(0, -1) : route.path}`,
        dest: route.dest,
      });
    } else {
      configJson.routes.push({
        src: `/.*`,
        dest: route.dest,
      });
    }
  }

  await writeFile(vercelConfigFile, JSON.stringify(configJson, null, 2), "utf8");
};

type RemixViteResolvedConfig = ResolvedConfig & {
  __remixPluginContext: RemixPluginContext;
  __remixServerBundleBuildConfig?: ServerBundleBuildConfig;
};

const vercelServerlessBuild = (options: VercelServerlessBuildOptions): Plugin => {
  const __dirname = fileURLToPath(new URL(".", import.meta.url));
  const appDir = options.appDir || "app";

  let root = "";
  let outDir = "";
  let ssrBuild: boolean | undefined;
  let ssrExternal: SsrExternal;
  let commonjsOptions: RollupCommonJSOptions;
  let serverBundleBuildConfig: ServerBundleBuildConfig | undefined;

  const cacheFiles = options.cacheFiles ?? [];
  const cacheFolders = options.cacheFolders ?? [];

  return {
    name: "vite-plugin-remix-vercel-serverless",
    apply(_config: UserConfig, { command, isSsrBuild }: ConfigEnv) {
      ssrBuild = isSsrBuild;

      return command === "build";
    },
    enforce: "post",
    async configResolved(config) {
      root = config.root || cwd();
      outDir = config.build.outDir;
      ssrExternal = config.ssr.external;
      commonjsOptions = config.build.commonjsOptions;
      serverBundleBuildConfig = (config as RemixViteResolvedConfig).__remixServerBundleBuildConfig;

      if (!ssrBuild) {
        if ((config as RemixViteResolvedConfig).__remixPluginContext.remixConfig.serverBundles) {
          if (!options.serverRoutes) {
            throw new Error(
              "Please set `serverRoutes` option, because Remix's ServerBundles is built in parallel, this plug-in cannot write to vercel's config routes.",
            );
          }
        } else {
          options.serverRoutes = undefined;
        }
      }
    },
    writeBundle: async () => {
      console.log("bundle Vercel Serverless for production...");

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
      const vercelOutput = join(vercelRoot, "output");
      const vercelConfigFile = join(vercelOutput, "config.json");
      const serverBundleId = serverBundleBuildConfig ? serverBundleBuildConfig.serverBundleId : "site";

      const functionName = `_${serverBundleId}`;
      const serverRoutes: ServerRoute[] = options.serverRoutes || [{ path: "", dest: functionName }];

      if (!ssrBuild) {
        await rm(vercelRoot, { recursive: true, force: true });
        await mkdir(vercelRoot, { recursive: true });
        await mkdir(vercelOutput, { recursive: true });
        await copyStaticFiles(outDir, vercelOutput);
        await initConfigJson(options.cleanUrls, cacheFiles, cacheFolders, serverRoutes, vercelConfigFile);
      } else {
        const [entryFile, defaultHandler] = await buildEntry(
          outDir,
          join(__dirname, "vercel-serverless-entry.js"),
          join(root, appDir),
        );

        const bundleFile = await bundleServer(
          outDir,
          entryFile,
          join(root, "package.json"),
          commonjsOptions,
          ssrExternal,
        );

        if (defaultHandler) {
          await rm(defaultHandler, { force: true });
        }

        await copyFunctionsFiles(
          root,
          vercelOutput,
          bundleFile,
          functionName,
          options.regions,
          join(outDir, "package.json"),
        );
      }
    },
  };
};

export default vercelServerlessBuild;
