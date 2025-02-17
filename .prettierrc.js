import prettierConfig from "@resolid/config/prettier";

/**
 * @type {import("prettier").Config}
 */
const config = {
  ...prettierConfig,
  plugins: [...prettierConfig.plugins, "prettier-plugin-tailwindcss"],
};

export default config;
