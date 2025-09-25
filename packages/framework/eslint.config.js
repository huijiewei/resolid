import eslintNode from "@resolid/config/eslint.node";
import eslintReact from "@resolid/config/eslint.react";
import eslintTypescript from "@resolid/config/eslint.typescript";

export default [...eslintTypescript, ...eslintReact, ...eslintNode];
