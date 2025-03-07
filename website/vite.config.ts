import { reactRouter } from "@react-router/dev/vite";
import { reactRouterHonoServer } from "@resolid/react-router-hono/dev";
import tailwindcss from "@tailwindcss/vite";
import { extname } from "node:path";
import { defineConfig, type UserConfig } from "vite";
import babel from "vite-plugin-babel";
import viteInspect from "vite-plugin-inspect";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command }) => {
  const isBuild = command == "build";

  const config: UserConfig = {
    plugins: [
      reactRouterHonoServer({
        entryFile: "server.node.ts",
      }),
      reactRouter(),
      tailwindcss(),
      babel({
        filter: /\.[jt]sx?$/,
        babelConfig: {
          compact: false,
          presets: ["@babel/preset-typescript"],
          plugins: [
            [
              "babel-plugin-react-compiler",
              {
                target: "19",
              },
            ],
          ],
        },
        loader: (path) => {
          return extname(path).substring(1) as "js" | "jsx";
        },
      }),
      tsconfigPaths(),
      !isBuild && viteInspect(),
    ].filter(Boolean),
    environments: {
      ssr: {
        build: {
          target: "node22",
          rollupOptions: {
            output: {
              hoistTransitiveImports: false,
              manualChunks: undefined,
            },
          },
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
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
              id.includes("/node_modules/turbo-stream/") ||
              id.includes("react-router/with-props")
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
    ssr: {
      external: ["@node-rs/bcrypt"],
    },
    optimizeDeps: {
      include: ["react-hook-form", "remix-hook-form"],
      exclude: ["@node-rs/bcrypt"],
    },
  };

  return config;
});
