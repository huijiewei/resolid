import { defineConfig, type Options } from "tsup";

const baseConfig: Options = {
  format: ["esm"],
  platform: "node",
  target: "node20",
  dts: true,
  treeshake: true,
  clean: true,
};

export default defineConfig([
  {
    ...baseConfig,
    entry: {
      "flex-routes": "src/flex-routes/index.ts",
    },
  },
  {
    ...baseConfig,
    entry: {
      "node-hono": "src/node-hono/plugin.ts",
    },
  },
  {
    ...baseConfig,
    entry: {
      "node-hono-entry": "src/node-hono/entry.ts",
    },
    external: ["./index.js"],
    dts: false,
  },
  {
    ...baseConfig,
    entry: {
      "vercel-serverless": "src/vercel-serverless/plugin.ts",
    },
  },
  {
    ...baseConfig,
    entry: {
      "vercel-serverless-entry": "src/vercel-serverless/entry.ts",
    },
    external: ["./index.js"],
    dts: false,
  },
]);
