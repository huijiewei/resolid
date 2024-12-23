import eslintBrowser from "@resolid/config/eslint.browser";
import eslintNode from "@resolid/config/eslint.node";
import eslintReact from "@resolid/config/eslint.react";

export default [
  ...eslintReact,
  ...eslintBrowser,
  ...eslintNode,
  {
    ignores: [".react-router/*"],
  },
];
