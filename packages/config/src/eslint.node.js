import n from "eslint-plugin-n";
import globals from "globals";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    plugins: { n },
    rules: {
      "n/handle-callback-err": ["error", "^(err|error)$"],
      "n/no-deprecated-api": "error",
      "n/no-exports-assign": "error",
      "n/no-new-require": "error",
      "n/no-path-concat": "error",
      "n/prefer-global/buffer": ["error", "never"],
      "n/prefer-global/process": ["error", "never"],
      "n/process-exit-as-throw": "error",
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
