# @resolid/remix-plugins

[English](README.md)

Resolid Remix 扩展插件包, 主要是对 Remix 进行强化的一些插件, 需配合 Vite 使用

## 功能

- [路由增强](#路由增强)
- [Node.js Hono 适配器](#nodejs-hono-适配器)
- [Vercel Serverless 适配器](#vercel-serverless-适配器)

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
- 以 `_` 为前缀的文件和文件夹变得不可见, 从而允许在不影响路由路径的情况下进行文件夹组织, 例如: `/_legal-pages/privacy-policy.tsx` 将匹配 `/privacy-policy`
- `$.tsx` 泼溅路由将匹配 URL 的其余部分, 包括斜杠, 比如 `/files/$.tsx` 将匹配 `/files`, `/files/one`, `/files/one/two`

> 路由规则大部分和 Remix 的路由兼容, 只是增加了文件夹结构

## 适配器

> 2.0 版本插件的适配器使用了 Remix 的 Preset 功能, 所以只能兼容 2.8.0 以上版本的 Remix

适配器都是基于 [hono](https://hono.dev/) 中间件运行, 默认 remixHandler 为:

```js
import { createRequestHandler } from "@remix-run/server-runtime";

export default function remixHandler(build, c) {
  const requestHandler = createRequestHandler(build, "production");

  return requestHandler(c.req.raw);
}
```

你可以在 Remix App 目录下新建 `remix.handler.ts` 或者 `remix.handler.js` 文件来更改默认 handler 行为, 比如给 Remix loadContext 增加 IP 地址

```ts
import { createRequestHandler, type ServerBuild } from "@remix-run/server-runtime";
import type { Context } from "hono";

export default function remixHandler(build: ServerBuild, c: Context) {
  const requestHandler = createRequestHandler(build, "production");

  const remoteAddress = c.req.header("x-vercel-deployment-url")
    ? c.req.header("x-forwarded-for")
    : c.env.incoming.socket.remoteAddress;

  return requestHandler(c.req.raw, {
    remoteAddress: remoteAddress,
  });
}
```

### Node.js Hono 适配器

将 Remix 应用打包成基于 hono 运行的服务器单文件, 可以使用 pm2 在 VPS 上自主运行

#### 需先安装相关依赖

```bash
pnpm add hono @hono/node-server
```

#### 配置

编辑 `vite.config.ts` 文件

```ts
import { nodeHonoPreset } from "@resolid/remix-plugins/node-hono";

export default {
  remix: {
    presets: [nodeHonoPreset()]
  },
};
```

此适配器支持 `SERVE_PORT` 和 `SERVE_PATH` 环境变量, `SERVE_PATH` 环境变量用于 Remix 的 serverBundles 功能

> 运行 build 成功以后自动会在 `build/server` 目录下生成 `server.mjs` 和 `package.json` 文件, `package.json` 文件里面定义了 Vite 设置的 `ssr.external`, 在服务器目录下运行 `npm install` 即可安装构建时排除的依赖



### Vercel Serverless 适配器

> 你可以使用 https://github.com/huijiewei/remix-vite-vercel-template 模版快速部署到 Vercel.

#### 需先安装相关依赖

```bash
pnpm add hono @hono/node-server
```

#### 配置

编辑 `vite.config.ts` 文件

```ts
import { vercelServerlessPreset } from "@resolid/remix-plugins/vercel-serverless";

export default {
  remix: {
    presets: [vercelServerlessPreset({
      // 部署区域
      regions: "sin1",
      // 有些包会根据不同平台引入二进制包, 安装的时候二进制包不在同一目录, 比如 @node-rs/bcrypt
      copyParentModules: ["@node-rs/bcrypt"]
    })]
  }
};
```

> Vercel 项目 Framework Preset 需设置为 Vite, Node.js Version 需设置为 20.x
>
> 如果你使用的是 monorepo 结构, 请设置 Root Directory 为需要部署的项目目录, 然后自定义相关命令, [Resolid](https://github.com/huijiewei/resolid) 的配置如下图
> ![Vercel相关设置](.github/assets/vercel-settings.png)

## 致谢

- [@remix-galaxy/remix-hono-vite](https://github.com/rphlmr/remix-galaxy)
