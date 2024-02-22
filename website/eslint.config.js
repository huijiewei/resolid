import eslintBowser from "@resolid/config/eslint.bowser";
import eslintNode from "@resolid/config/eslint.node";
import eslintReact from "@resolid/config/eslint.react";

export default [
  {
    ignores: ["**/build"],
  },
  ...eslintReact,
  ...eslintBowser,
  ...eslintNode,
];
