import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import resolidTailwind from "../packages/tailwind/src";

export default <Partial<Config>>{
  content: [
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
    "./node_modules/@resolid/react-ui/dist/*.js",
    "./node_modules/@resolid/react-ui/src/**/*.{ts,tsx}",
  ],
  presets: [resolidTailwind.preset()],
  plugins: [typography],
};
