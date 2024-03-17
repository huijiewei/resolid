import typescript from "typescript-eslint";
import eslintBase from "./eslint.base.js";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default typescript.config(...eslintBase, ...typescript.configs.recommended, {
  rules: {
    "@typescript-eslint/no-import-type-side-effects": "error",
    "@typescript-eslint/method-signature-style": ["error", "property"],
  },
});
