/** @type {import('prettier').Options} */
const config = {
  tailwindConfig: "./website/tailwind.config.ts",
  plugins: ["prettier-plugin-organize-imports", "prettier-plugin-tailwindcss"],
};

export default config;
