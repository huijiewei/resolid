import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import { remarkDocgen } from "@resolid/mdx-plugins";
import { reactRouterHonoServer } from "@resolid/react-router-hono/dev";
import rehypeShiki from "@shikijs/rehype";
import { extname, join } from "node:path";
import { cwd } from "node:process";
import { fileURLToPath } from "node:url";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { type AliasOptions, loadEnv } from "vite";
import babel from "vite-plugin-babel";
import viteInspect from "vite-plugin-inspect";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig, type ViteUserConfig } from "vitest/config";

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
      reactRouterHonoServer({
        entryFile: "server.node.ts",
      }),
      reactRouter(),
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
                  id.includes("/node_modules/@react-router/") ||
                  id.includes("/node_modules/react-router/") ||
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
      exclude: ["@node-rs/bcrypt"],
    },
  };

  return config;
});
