import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  content: ["./src/**/*.{js,ts,tsx,mdx}"],
  theme: {},
  plugins: [typography],
};
