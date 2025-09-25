import eslintBrowser from "@resolid/config/eslint.browser";
import eslintNode from "@resolid/config/eslint.node";
import eslintReact from "@resolid/config/eslint.react";
import eslintTypescript from "@resolid/config/eslint.typescript";
import reactYouMightNotNeedAnEffect from "eslint-plugin-react-you-might-not-need-an-effect";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  ...eslintTypescript,
  ...eslintReact,
  ...eslintBrowser,
  ...eslintNode,
  reactYouMightNotNeedAnEffect.configs.recommended,
  {
    ignores: [".react-router/*"],
  },
];
