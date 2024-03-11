import mdx from "@mdx-js/rollup";
import { vitePlugin as remix } from "@remix-run/dev";
import { remarkDocgen } from "@resolid/mdx-plugins";
import remixFlexRoutes from "@resolid/remix-plugins/flex-routes";
import { nodeHonoPreset } from "@resolid/remix-plugins/node-hono";
import { vercelServerlessPreset } from "@resolid/remix-plugins/vercel-serverless";
import rehypeShiki from "@shikijs/rehype";
import { join } from "node:path";
import { env } from "node:process";
import { fileURLToPath } from "node:url";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig, splitVendorChunkPlugin, type AliasOptions, type UserConfig } from "vite";
import viteInspect from "vite-plugin-inspect";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command }) => {
  const isBuild = command == "build";
  const buildEnv = env.BUILD_ENV;

  const __dirname = fileURLToPath(new URL(".", import.meta.url));
  const appDirectory = "src";

  const config: UserConfig = {
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
          buildEnv == "vercel"
            ? vercelServerlessPreset({
                regions: "sin1",
                cleanUrls: true,
                cacheFiles: ["favicon.svg", "apple-touch-icon.png", "manifest.webmanifest"],
                cacheFolders: ["icons", "images"],
              })
            : nodeHonoPreset(),
        ],
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
        },
        ignoredRouteFiles: ["**/*"],
        routes: async () => {
          return await remixFlexRoutes({
            appDir: appDirectory,
            ignoredRouteFiles: ["**/.*", "**/__*.*", "**/*.demo.tsx"],
          });
        },
      }),
      splitVendorChunkPlugin(),
      !isBuild && tsconfigPaths(),
      !isBuild && viteInspect(),
    ].filter(Boolean),
    build: {
      minify: true,
      rollupOptions: {
        output: {
          hoistTransitiveImports: false,
          manualChunks(id) {
            if (id.includes("/src/components/base/")) {
              return "components";
            }

            if (
              id.includes("/node_modules/react/") ||
              id.includes("/node_modules/react-dom/") ||
              id.includes("/node_modules/react-is/") ||
              id.includes("/node_modules/scheduler/") ||
              id.includes("/node_modules/prop-types/") ||
              id.includes("/node_modules/loose-envify/")
            ) {
              return "react";
            }

            if (id.includes("/node_modules/@resolid/") || id.includes("/packages/")) {
              return "resolid";
            }

            if (id.includes("/node_modules/")) {
              return "vendor";
            }
          },
        },
      },
    },
    esbuild: { legalComments: "none" },
    resolve: {
      alias: [
        {
          find: "@dbInstance",
          replacement: join(__dirname, `./${appDirectory}/foundation/db.server.ts`),
        },
        isBuild && { find: "~", replacement: join(__dirname, `./${appDirectory}`) },
      ].filter(Boolean) as AliasOptions,
    },
    optimizeDeps: {
      include: ["@mdx-js/react"],
    },
  };

  return config;
});
