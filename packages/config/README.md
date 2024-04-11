# @resolid/config

Resolid 通用配置, 包含了 `TypeScript`, `ESLint` 的基础配置

## 使用方法

### 安装

```bash
pnpm add -D eslint @resolid/config
```

### TypeScript 配置

增加下面内容到 `tsconfig.json`

#### 普通项目

```json
{
  "extends": "@resolid/config/tsconfig.base"
}
```

#### React 项目

```json
{
  "extends": "@resolid/config/tsconfig.react"
}
```

### ESLint 配置

本配置包是纯 ESM 包, 并使用了 ESLint 扁平配置, 需要使用 `eslint.config.js` 文件来进行配置

语言选项默认为 `ecmaVersion: 2022`, `sourceType: 'module'`

#### TypeScript Lint 配置

```js
// eslint.config.js
import eslintTypescript from "@resolid/config/eslint.typescript";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [...eslintTypescript];
```

#### React Lint 配置

```js
// eslint.config.js
import eslintReact from "@resolid/config/eslint.react";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [...eslintReact];
```

### ESLint 环境设置

```js
// eslint.config.js

// 浏览器环境
import eslintBowser from "@resolid/config/eslint.bowser";

// Node 环境
import eslintNode from "@resolid/config/eslint.node";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [...eslintBowser, ...eslintNode];
```

### ESLint 配置查看

你可以进入拥有 `eslint.config.js` 文件的目录运行下面的命令来检查

```bash
npx eslint-flat-config-viewer
```

## 致谢

- [ESLint Config Inspector](https://github.com/eslint/config-inspector) 用于检查和理解 ESLint 平面配置的可视化工具。
