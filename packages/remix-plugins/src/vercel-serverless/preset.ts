import type { BuildManifest, Preset } from "@remix-run/dev";
import type { RouteManifest } from "@remix-run/dev/dist/config/routes";
import { nodeFileTrace } from "@vercel/nft";
import { cp, mkdir, readdir, realpath, rm, writeFile } from "node:fs/promises";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { buildEntry, bundleServer } from "../base/build-utils";

export type VercelServerlessPresetOptions = {
  regions: string | string[];
};

export const vercelServerlessPreset = (options: VercelServerlessPresetOptions): Preset => {
  const __dirname = fileURLToPath(new URL(".", import.meta.url));

  return {
    name: "resolid-vercel-serverless-preset",
    remixConfig: () => {
      return {
        buildEnd: async ({ buildManifest, remixConfig, viteConfig }) => {
          const rootPath = viteConfig.root;
          const appPath = remixConfig.appDirectory;
          const serverBuildFile = remixConfig.serverBuildFile;

          const clientBuildPath = join(remixConfig.buildDirectory, "client");
          const serverBuildPath = join(remixConfig.buildDirectory, "server");

          const ssrExternal = viteConfig.ssr.external;
          const commonjsOptions = viteConfig.build.commonjsOptions;

          const serverBundles = buildManifest?.serverBundles ?? {
            site: { id: "site", file: relative(rootPath, join(serverBuildPath, serverBuildFile)) },
          };

          console.log("bundle Vercel Serverless for production...");

          const vercelRoot = join(rootPath, ".vercel");
          await rm(vercelRoot, { recursive: true, force: true });
          await mkdir(vercelRoot, { recursive: true });

          const vercelOutput = join(vercelRoot, "output");
          await mkdir(vercelOutput, { recursive: true });

          await copyStaticFiles(clientBuildPath, vercelOutput);
          await writeVercelConfigJson(viteConfig.build.assetsDir, buildManifest, join(vercelOutput, "config.json"));

          for (const key in serverBundles) {
            const serverBundleId = serverBundles[key].id;
            const buildFile = join(rootPath, serverBundles[key].file);
            const buildPath = dirname(buildFile);

            const [entryFile, defaultHandler] = await buildEntry(
              appPath,
              join(__dirname, "vercel-serverless-entry.js"),
              buildPath,
              buildFile,
            );

            const bundleFile = await bundleServer(
              buildPath,
              entryFile,
              join(rootPath, "package.json"),
              commonjsOptions,
              ssrExternal,
            );

            if (defaultHandler) {
              await rm(defaultHandler, { force: true });
            }

            await copyFunctionsFiles(
              rootPath,
              vercelOutput,
              buildPath,
              serverBuildFile,
              bundleFile,
              `_${serverBundleId}`,
              options.regions,
            );
          }
        },
      };
    },
  };
};

const copyFunctionsFiles = async (
  rootPath: string,
  vercelOutDir: string,
  buildPath: string,
  serverBuildFile: string,
  bundleFile: string,
  functionName: string,
  functionRegions: string | string[],
) => {
  const vercelFunctionDir = join(vercelOutDir, "functions", `${functionName}.func`);
  await mkdir(vercelFunctionDir, { recursive: true });

  const traced = await nodeFileTrace([bundleFile], {
    base: rootPath,
  });

  for (const file of traced.fileList) {
    const source = join(rootPath, file);

    if (source == bundleFile) {
      continue;
    }

    const dest = join(vercelFunctionDir, relative(rootPath, source));
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

  await cp(bundleFile, join(vercelFunctionDir, "index.mjs"));

  for (const file of (await readdir(buildPath)).filter(
    (file) => file != basename(bundleFile) && file != serverBuildFile,
  )) {
    await cp(join(buildPath, file), join(vercelFunctionDir, file), { recursive: true });
  }
};

const copyStaticFiles = async (outDir: string, vercelOutDir: string) => {
  const vercelStaticDir = join(vercelOutDir, "static");

  await mkdir(vercelStaticDir, { recursive: true });
  await cp(outDir, vercelStaticDir, {
    recursive: true,
    force: true,
  });
  await rm(join(vercelStaticDir, ".vite"), { recursive: true, force: true });
};

const getRoutePathsFromParentId = (routes: RouteManifest, parentId: string | undefined) => {
  if (parentId == undefined) {
    return [];
  }

  const paths: string[] = [];

  const findPath = (routeId: string) => {
    const route = routes[routeId];

    if (route.parentId) {
      findPath(route.parentId);
    }

    if (route.path) {
      paths.push(route.path);
    }
  };

  findPath(parentId);

  return paths;
};

const getServerRoutes = (buildManifest: BuildManifest | undefined) => {
  if (buildManifest?.routeIdToServerBundleId) {
    const routes: { id: string; path: string }[] = Object.values(buildManifest.routes)
      .filter((route) => route.id != "root")
      .map((route) => {
        return {
          id: route.id,
          path: "/" + [...getRoutePathsFromParentId(buildManifest.routes, route.parentId), route.path].join("/"),
        };
      });

    const routePathBundles: Record<string, string[]> = {};

    for (const routeId in buildManifest?.routeIdToServerBundleId) {
      const serverBoundId = buildManifest?.routeIdToServerBundleId[routeId];

      if (!routePathBundles[serverBoundId]) {
        routePathBundles[serverBoundId] = [];
      }

      for (const routePath of routes) {
        if (routePath.id == routeId) {
          routePathBundles[serverBoundId].push(routePath.path);
        }
      }
    }

    const bundleRoutes: Record<string, { path: string; bundleId: string }> = {};

    for (const bundleId in routePathBundles) {
      const paths = routePathBundles[bundleId];

      paths.sort((a, b) => (a.length < b.length ? -1 : 1));

      for (const path of paths) {
        if (
          !bundleRoutes[path] &&
          !Object.keys(bundleRoutes).find((key) => {
            return bundleRoutes[key].bundleId == bundleId && path.startsWith(bundleRoutes[key].path);
          })
        ) {
          bundleRoutes[path] = { path: path, bundleId: bundleId };
        }
      }
    }

    const result = Object.values(bundleRoutes).map((route) => {
      return { path: route.path.slice(0, -1), bundleId: route.bundleId };
    });

    result.sort((a, b) => (a.path.length > b.path.length ? -1 : 1));

    return result;
  }

  return [{ path: "", bundleId: "site" }];
};

const writeVercelConfigJson = async (
  assetsDir: string,
  buildManifest: BuildManifest | undefined,
  vercelConfigFile: string,
) => {
  const configJson: { version: number; routes: unknown[] } = {
    version: 3,
    routes: [],
  };

  configJson.routes.push({
    src: `^/${assetsDir}/(.*)$`,
    headers: { "cache-control": "public, max-age=31536000, immutable" },
    continue: true,
  });

  configJson.routes.push({
    handle: "filesystem",
  });

  const bundleRoutes = getServerRoutes(buildManifest);

  for (const bundle of bundleRoutes) {
    if (bundle.path.length > 0) {
      configJson.routes.push({
        src: `^${bundle.path}.*`,
        dest: `_${bundle.bundleId}`,
      });
    } else {
      configJson.routes.push({
        src: `/(.*)`,
        dest: `_${bundle.bundleId}`,
      });
    }
  }

  await writeFile(vercelConfigFile, JSON.stringify(configJson, null, 2), "utf8");
};
