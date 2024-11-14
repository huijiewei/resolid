import { extname, join } from "node:path";
import { cwd, env } from "node:process";
import { fileURLToPath } from "node:url";
import mdx from "@mdx-js/rollup";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { remarkDocgen } from "@resolid/mdx-plugins";
import { devServer } from "@resolid/remix-plugins/dev-server";
import remixFlexRoutes from "@resolid/remix-plugins/flex-routes";
import { nodePreset } from "@resolid/remix-plugins/node-preset";
import { vercelPreset } from "@resolid/remix-plugins/vercel-preset";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { type AliasOptions, loadEnv } from "vite";
import babel from "vite-plugin-babel";
import viteInspect from "vite-plugin-inspect";
import tsconfigPaths from "vite-tsconfig-paths";
import { type ViteUserConfig, defineConfig } from "vitest/config";

installGlobals({ nativeFetch: true });

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

const ReactCompilerConfig = {
  target: "19", // '17' | '18' | '19'
};

export default defineConfig(({ command, isSsrBuild }) => {
  const isBuild = command == "build";

  const __dirname = fileURLToPath(new URL(".", import.meta.url));
  const appDirectory = "src";

  const config: ViteUserConfig = {
    test: {
      env: loadEnv("test", cwd(), ""),
    },
    plugins: [
      mdx({
        providerImportSource: "@mdx-js/react",
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeShiki,
            {
              themes: {
                light: "github-light",
                dark: "github-dark",
              },
            },
          ],
        ],
        remarkPlugins: [
          remarkFrontmatter,
          remarkMdxFrontmatter,
          remarkGfm,
          [remarkDocgen, { sourceRoot: join(__dirname, "../packages/react-ui/src/components") }],
        ],
      }),
      devServer({
        appDirectory: appDirectory,
        entryFile: "server.node.ts",
      }),
      remix({
        appDirectory: appDirectory,
        presets: [
          env.VERCEL == "1"
            ? vercelPreset({
                regions: "sin1",
                copyParentModules: ["@node-rs/bcrypt"],
                entryFile: "server.vercel.ts",
              })
            : nodePreset({
                entryFile: "server.node.ts",
              }),
        ],
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          v3_singleFetch: true,
          v3_lazyRouteDiscovery: true,
          unstable_optimizeDeps: true,
        },
        serverBundles: ({ branch }) => {
          return branch.some((route) => {
            return route.id.startsWith("routes/admin");
          })
            ? "admin"
            : "site";
        },
        ignoredRouteFiles: ["**/*"],
        routes: async () => {
          return await remixFlexRoutes({
            appDir: appDirectory,
            ignoredRouteFiles: ["**/.*", "**/__*/*", "**/__*.*"],
          });
        },
      }),
      babel({
        babelConfig: {
          compact: false,
          presets: ["@babel/preset-typescript"],
          plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
        },
        filter: /\.[jt]sx?$/,
        loader: (path) => {
          return extname(path).substring(1) as "js" | "jsx";
        },
      }),
      !isBuild && tsconfigPaths(),
      !isBuild && viteInspect(),
    ].filter(Boolean),
    build: {
      target: isSsrBuild ? "node20" : "modules",
      cssTarget: ["edge88", "firefox78", "chrome87", "safari14"],
      rollupOptions: {
        output: {
          hoistTransitiveImports: false,
          manualChunks: isSsrBuild
            ? undefined
            : (id) => {
                if (
                  id.includes("/node_modules/react/") ||
                  id.includes("/node_modules/react-dom/") ||
                  id.includes("/node_modules/react-is/") ||
                  id.includes("/node_modules/scheduler/")
                ) {
                  return "react";
                }

                if (
                  id.includes("/node_modules/@remix-run/") ||
                  id.includes("/node_modules/react-router/") ||
                  id.includes("/node_modules/react-router-dom/") ||
                  id.includes("/node_modules/turbo-stream/")
                ) {
                  return "react-router";
                }

                if (id.includes("/src/components/base/")) {
                  return "components";
                }
              },
        },
      },
    },
    esbuild: { legalComments: "none" },
    resolve: {
      alias: [isBuild && { find: "~", replacement: join(__dirname, `./${appDirectory}`) }].filter(
        Boolean,
      ) as AliasOptions,
    },
    ssr: {
      external: ["@node-rs/bcrypt"],
    },
    optimizeDeps: {
      include: [
        "@mdx-js/react",
        "react-hook-form",
        "remix-hook-form",
        "zod",
        "@hookform/resolvers/zod",
        "@remix-run/node",
        "react/compiler-runtime",
        "@vercel/analytics/react",
        "@vercel/speed-insights/remix",
        "@resolid/react-ui > react-remove-scroll-bar",
        "@resolid/react-ui > @tw-classed/core",
        "@resolid/react-ui > clsx",
        "@resolid/react-ui > @floating-ui/react",
        "@resolid/react-ui > @tanstack/react-virtual",
        "@resolid/utils > nanoid",
      ],
      exclude: ["@node-rs/bcrypt"],
    },
  };

  return config;
});
