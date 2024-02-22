import { env } from "node:process";

/** @type {import("postcss-load-config").Config} */
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(env.NODE_ENV === "production" ? { cssnano: { preset: "default" } } : {}),
  },
};
