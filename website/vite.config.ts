import mdx from "@mdx-js/rollup";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { remarkDocgen } from "@resolid/mdx-plugins";
import remixFlexRoutes from "@resolid/remix-plugins/flex-routes";
import { nodeHonoPreset } from "@resolid/remix-plugins/node-hono";
import { vercelServerlessPreset } from "@resolid/remix-plugins/vercel-serverless";
import rehypeShiki from "@shikijs/rehype";
import { join } from "node:path";
import { cwd, env } from "node:process";
import { fileURLToPath } from "node:url";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { loadEnv, type AliasOptions } from "vite";
import viteInspect from "vite-plugin-inspect";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig, type UserConfig } from "vitest/config";

installGlobals({ nativeFetch: true });

export default defineConfig(({ command, isSsrBuild }) => {
  const isBuild = command == "build";

  const __dirname = fileURLToPath(new URL(".", import.meta.url));
  const appDirectory = "src";

  const config: UserConfig = {
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
      remix({
        appDirectory: appDirectory,
        presets: [
          env.VERCEL == "1"
            ? vercelServerlessPreset({
                regions: "sin1",
                copyParentModules: ["@node-rs/bcrypt"],
              })
            : nodeHonoPreset(),
        ],
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          unstable_singleFetch: true,
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
      !isBuild && tsconfigPaths(),
      !isBuild && viteInspect(),
    ].filter(Boolean),
    build: {
      target: isSsrBuild ? "node20" : "modules",
      cssTarget: ["edge88", "firefox78", "chrome87", "safari14"],
      minify: true,
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
      include: ["@mdx-js/react", "react-hook-form", "remix-hook-form"],
      exclude: ["@node-rs/bcrypt"],
    },
  };

  return config;
});
