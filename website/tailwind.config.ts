import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import resolidTailwind from "../packages/tailwind/src";

export default <Partial<Config>>{
  content: ["./src/**/*.{js,jsx,ts,tsx,mdx}"],
  presets: [resolidTailwind.preset()],
  plugins: [typography],
};
