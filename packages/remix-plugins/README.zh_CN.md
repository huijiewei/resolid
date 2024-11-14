# @resolid/remix-plugins

[English](README.md)

Resolid Remix 扩展插件包, 主要是对 Remix 进行强化的一些插件, 需配合 Vite 使用

## 功能

- [路由增强](#路由增强)
- [Hono 服务器](#hono-服务器)
  - [Node.js 服务](#nodejs-服务)
  - [配置开发服务器](#配置开发服务器)
  - [Vercel 服务](#vercel-服务)
  - [Hono 中间件](#hono-中间件)
  - [Remix 负载上下文](#remix-负载上下文)

## 安装

```bash
pnpm add -D @resolid/remix-plugins
```

### 路由增强

Remix 默认使用的是平面文件路由,用 `.` 来分割 URL, 这种形式小项目还好, 一旦遇到大的项目就不太舒服了, 所以我开发了混合目录和文件的路由系统

#### 配置

编辑 `vite.config.ts` 文件

```ts
import { vitePlugin as remix } from "@remix-run/dev";
import remixFlexRoutes from "@resolid/remix-plugins/flex-routes";

export default {
  plugins: [
    remix({
      ignoredRouteFiles: ["**/*"],
      routes: async () => {
        return await remixFlexRoutes({
          ignoredRouteFiles: ["**/.*"],
        });
      },
    }),
  ],
};
```

#### 规则

- 路由是使用文件夹定义和嵌套的, 与在 nginx 服务器上布局 HTML 文件的方式非常相似
- `_layout` 文件包装了下游的所有路由, 这些需要一个 `<Outlet />` 来渲染子路由
- `_index` 文件是文件夹的默认文件, 例如：`/users/_index.tsx` 将匹配 `/users`
- 变量在文件路径中使用 `$` 表示, 例如: `/users/$id/edit.tsx` 将匹配 `/users/123/edit`
- 将路线段括在括号中将使该段成为可选, 例如: `/($lang)/categories.tsx` 将匹配 `/categories`, `/zh/categories`
- 可以使用 `[]` 对路由约定的特殊字符进行转义, 例如: `/make-[$$$]-fast-online.tsx` 将匹配 `/make-$$$-fast-online`
- 以 `_` 为前缀的文件和文件夹变得不可见, 从而允许在不影响路由路径的情况下进行文件夹组织, 例如:
  `/_legal-pages/privacy-policy.tsx` 将匹配 `/privacy-policy`
- `$.tsx` 泼溅路由将匹配 URL 的其余部分, 包括斜杠, 比如 `/files/$.tsx` 将匹配 `/files`, `/files/one`, `/files/one/two`

> 路由规则大部分和 Remix 的路由兼容, 只是增加了文件夹结构

## Hono 服务器

### 安装相关依赖

```bash
pnpm add hono @hono/node-server
```

### Node.js 服务

#### 创建 Node.js 服务

```ts
// app/server.node.ts

import { createHonoNodeServer } from "@resolid/remix-plugins/node-server";

export const server = await createHonoNodeServer();
```

#### 配置 Remix 插件 Node.js Preset

```ts
// vite.config.ts

import { vitePlugin as remix } from "@remix-run/dev";
import { nodePreset } from "@resolid/remix-plugins/node-preset";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      presets: [
        nodePreset({
          // 入口文件
          entryFile: "server.node.ts" // 默认为 server.ts
        })
      ]
    }),
    tsconfigPaths()
  ]
});
```

支持 `SERVER_PORT` 和 `SERVER_PATH` 环境变量, `SERVER_PATH` 环境变量用于 Remix 的 serverBundles 功能

> 运行 build 成功以后自动会在 `build/server` 目录下生成 `server.mjs` 和 `package.json` 文件, `package.json` 文件里面定义了
> Vite 设置的 `ssr.external`, 在服务器目录下运行 `npm install` 即可安装构建时排除的依赖

### 配置开发服务器

首先修改 vite.config.ts 文件配置开发服务器

```ts
// vite.config.ts

import { vitePlugin as remix } from "@remix-run/dev";
import { devServer } from "@resolid/remix-plugins/dev-server";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    devServer({
      // 入口文件
      entryFile: "server.node.ts"  // 默认为 server.ts
    }),
    remix(),
    tsconfigPaths()
  ]
});
```

然后更新 package.json 里面的开发运行脚本, 使用 vite

```json lines
// package.json
{
  "scripts": {
    "dev": "vite"
  }
  // ...
}
```

### Vercel 服务

> 你可以使用 https://github.com/huijiewei/remix-vite-vercel-template 模版快速部署到 Vercel.

#### 创建 Vercel 服务

```ts
// app/server.vercel.ts

import { createHonoVercelServer } from "@resolid/remix-plugins/vercel-server";

export const server = await createHonoVercelServer();

export default server;
```

##### 配置 Remix 插件 Vercel Preset

```ts
// vite.config.ts

import { vitePlugin as remix } from "@remix-run/dev";
import { vercelPreset } from "@resolid/remix-plugins/vercel-preset";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      presets: [
        vercelPreset({
          // 部署区域
          regions: "sin1",
          // 有些包会根据不同平台引入二进制包, 安装的时候二进制包不在同一目录, 比如 @node-rs/bcrypt
          copyParentModules: ["@node-rs/bcrypt"],
          // 入口文件
          entryFile: "server.vercel.ts" // 默认为 server.ts
        })
      ]
    }),
    tsconfigPaths()
  ]
});
```

> Vercel 项目 Framework Preset 需设置为 Vite, Node.js Version 需设置为 20.x
>
> 如果你使用的是 monorepo 结构, 请设置 Root Directory 为需要部署的项目目录,
> 然后自定义相关命令, [Resolid](https://github.com/huijiewei/resolid) 的配置如下图
> ![Vercel相关设置](.github/assets/vercel-settings.png)

### Hono 中间件

中间件是在 Remix 调用加载器/操作之前调用的函数, 请参阅 [Hono 文档](https://hono.dev/docs/guides/middleware) 以获取更多信息。

你可以配置 createHonoNodeServer 或者 createHonoVercelServer 的 configure 来方便使用 Hono 中间件

```ts
import { createHonoNodeServer } from "@resolid/remix-plugins/node-server";

export const server = await createHonoNodeServer({
  configure: (server) => {
    server.use(/* Hono 中间件 */);
  }
});
```

### Remix 负载上下文

如果您想向 Remix 加载上下文添加其他属性，你可以配置 createHonoNodeServer 或者 createHonoVercelServer 的 getLoadContext 来增加加载上下文

```ts
import { createHonoNodeServer } from "@resolid/remix-plugins/node-server";
import type { HttpBindings } from "@hono/node-server";
import type { Context } from "hono";

export const server = await createHonoNodeServer({
  getLoadContext: (c: Context<{ Bindings: HttpBindings }>) => {
    return {
      remoteAddress: c.env.incoming.socket.remoteAddress
    };
  }
});
```

## 致谢

- [@hono/vite-dev-server](https://github.com/honojs/vite-plugins/tree/main/packages/dev-server)
- [@remix-galaxy/remix-hono-vite](https://github.com/rphlmr/remix-galaxy)
