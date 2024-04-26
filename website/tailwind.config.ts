import { env } from "node:process";
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import resolidTailwind from "../packages/tailwind/src";

export default (<Partial<Config>>{
  content: [
    "./src/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/extensions/**/*.{js,jsx,ts,tsx}",
    "./src/routes/_site/**/*.{js,jsx,ts,tsx,mdx}",
    env.NODE_ENV == "production"
      ? "./node_modules/@resolid/react-ui/dist/*.js"
      : "./node_modules/@resolid/react-ui/src/**/*.{ts,tsx}",
  ],
  presets: [resolidTailwind.preset()],
  plugins: [typography],
});
