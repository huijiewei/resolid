import { join } from "node:path";
import { cwd } from "node:process";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  test: {
    env: loadEnv("test", cwd(), ""),
  },
  resolve: {
    alias: [
      {
        find: "@dbInstance",
        replacement: join(__dirname, `./src/tests/db.setup.ts`),
      },
    ],
  },
});
