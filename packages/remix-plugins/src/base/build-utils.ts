import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import esbuild from "esbuild";
import { existsSync } from "node:fs";
import { readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { exit } from "node:process";
import { rollup } from "rollup";
import type { PackageJson } from "type-fest";
import type { ResolvedConfig, RollupCommonJSOptions } from "vite";

export type BuildOptions = { appDir?: string };
export type SsrExternal = ResolvedConfig["ssr"]["external"];

const getPackageDependencies = (dependencies: Record<string, string | undefined>, ssrExternal: SsrExternal) => {
  const packageDependencies = Object.keys(dependencies)
    .filter((key) => {
      if (ssrExternal === undefined || ssrExternal === true) {
        return false;
      }

      return ssrExternal.includes(key);
    })
    .reduce((obj: Record<string, string>, key) => {
      obj[key] = packageDependencies[key] ?? "";

      return obj;
    }, {});

  return packageDependencies;
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
  outDir: string,
  entryFile: string,
  appDir: string,
): Promise<[string, string | null]> => {
  const outfile = join(outDir, "remix-entry.js");

  let handler = [".ts", ".js"].map((ext) => join(appDir, "remix.handler" + ext)).find((file) => existsSync(file));

  let defaultHandler: string | null = join(outDir, "remix.handler.js");

  if (handler == undefined) {
    await writeFile(
      defaultHandler,
      `
import { createRequestHandler } from "@remix-run/server-runtime";

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

  await esbuild
    .build({
      outfile: outfile,
      entryPoints: [entryFile],
      define: {
        "process.env.NODE_ENV": '"production"',
      },
      external: ["./index.js"],
      alias: {
        "~resolid-remix/handler": handler,
      },
      platform: "node",
      target: "node20",
      format: "esm",
      packages: "external",
      bundle: true,
    })
    .catch((error: unknown) => {
      console.error(error);
      exit(1);
    });

  return [outfile, defaultHandler];
};

export const bundleServer = async (
  outDir: string,
  entryFile: string,
  packageFile: string,
  commonjsOptions: RollupCommonJSOptions,
  ssrExternal: string[] | true | undefined,
) => {
  const pkg = JSON.parse(await readFile(packageFile, "utf8")) as PackageJson;

  const packageDependencies = getPackageDependencies({ ...pkg.dependencies, ...pkg.devDependencies }, ssrExternal);

  await writePackageJson(pkg, join(outDir, "package.json"), packageDependencies);

  const bundle = await rollup({
    input: entryFile,
    plugins: [
      nodeResolve({
        preferBuiltins: true,
        exportConditions: ["node"],
        dedupe: ["react", "react-dom", "@remix-run/react", "@remix-run/server-runtime"],
      }),
      commonjs({ ...commonjsOptions, strictRequires: true }),
      json(),
    ],
    external: Object.keys(packageDependencies),
    logLevel: "silent",
  });

  const bundleFile = join(outDir, "serve.mjs");

  await bundle.write({
    format: "esm",
    file: bundleFile,
    inlineDynamicImports: true,
  });

  await bundle.close();

  await rm(entryFile, { force: true });

  return bundleFile;
};
