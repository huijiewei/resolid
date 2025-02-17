import eslintBrowser from "@resolid/config/eslint.browser";
import eslintNode from "@resolid/config/eslint.node";
import eslintReact from "@resolid/config/eslint.react";
import eslintTypescript from "@resolid/config/eslint.typescript";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  ...eslintTypescript,
  ...eslintReact,
  ...eslintBrowser,
  ...eslintNode,
  {
    ignores: [".react-router/*"],
  },
];
