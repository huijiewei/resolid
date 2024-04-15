import esbuild from "esbuild";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { exit } from "node:process";
import type { PackageJson } from "type-fest";
import type { ResolvedConfig } from "vite";

export type SsrExternal = ResolvedConfig["ssr"]["external"];

const getPackageDependencies = (dependencies: Record<string, string | undefined>, ssrExternal: SsrExternal) => {
  if (Array.isArray(ssrExternal)) {
    ssrExternal = ssrExternal.filter((id) => !id.startsWith("@remix-run"));
  }

  return Object.keys(dependencies)
    .filter((key) => {
      if (ssrExternal === undefined || ssrExternal === true) {
        return false;
      }

      return ssrExternal.includes(key);
    })
    .reduce((obj: Record<string, string>, key) => {
      obj[key] = dependencies[key] ?? "";

      return obj;
    }, {});
};

const writePackageJson = async (pkg: PackageJson, outputFile: string, dependencies: unknown) => {
  const distPkg = {
    name: pkg.name,
    type: pkg.type,
    scripts: {
      postinstall: pkg.scripts?.postinstall ?? "",
    },
    dependencies: dependencies,
  };

  await writeFile(outputFile, JSON.stringify(distPkg, null, 2), "utf8");
};

export const buildEntry = async (
  appPath: string,
  entryFile: string,
  buildPath: string,
  buildFile: string,
  serverBundleId: string,
  packageFile: string,
  ssrExternal: string[] | true | undefined,
): Promise<[string, string | null]> => {
  console.log(`Bundle Server file for ${serverBundleId}...`);

  let handler = [".ts", ".js"].map((ext) => join(appPath, "remix.handler" + ext)).find((file) => existsSync(file));

  let defaultHandler: string | null = join(buildPath, "remix.handler.js");

  if (handler == undefined) {
    await writeFile(
      defaultHandler,
      `
import { createRequestHandler } from "@remix-run/node";

export default function remixHandler(build, c) {
  const requestHandler = createRequestHandler(build, "production");

  return requestHandler(c.req.raw);
}
`,
      "utf8",
    );
    handler = defaultHandler;
  } else {
    defaultHandler = null;
  }

  const pkg = JSON.parse(await readFile(packageFile, "utf8")) as PackageJson;

  const packageDependencies = getPackageDependencies({ ...pkg.dependencies }, ssrExternal);

  await writePackageJson(pkg, join(buildPath, "package.json"), packageDependencies);

  const bundleFile = join(buildPath, "serve.mjs");

  await esbuild
    .build({
      outfile: bundleFile,
      entryPoints: [entryFile],
      define: {
        "process.env.NODE_ENV": '"production"',
      },
      alias: {
        "~resolid-remix/server": buildFile,
        "~resolid-remix/handler": handler,
      },
      banner: { js: "import { createRequire } from 'module';const require = createRequire(import.meta.url);" },
      platform: "node",
      target: "node20",
      format: "esm",
      external: Object.keys(packageDependencies),
      bundle: true,
      charset: "utf8",
      treeShaking: true,
      legalComments: "none",
      minify: false,
    })
    .catch((error: unknown) => {
      console.error(error);
      exit(1);
    });

  return [bundleFile, defaultHandler];
};
