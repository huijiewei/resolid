# @resolid/remix-plugins

[English](README.md)

Resolid Remix 扩展插件包

这个包主要是对 Remix 进行强化的一些插件, 需配合 Vite 使用

## 安装

```bash
pnpm add -D @resolid/remix-plugins
```

## 路由增强

Remix 默认使用的是平面文件路由,用 `.` 来分割 URL, 这种形式小项目还好, 一旦遇到大的项目就不太舒服了, 所以我开发了混合目录和文件的路由系统

### 配置

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

### 规则

- 路由是使用文件夹定义和嵌套的, 与在 nginx 服务器上布局 HTML 文件的方式非常相似
- `_layout` 文件包装了下游的所有路由, 这些需要一个 `<Outlet />` 来渲染子路由
- `_index` 文件是文件夹的默认文件, 例如：`/users/_index.tsx` 将匹配 `/users`
- 变量在文件路径中使用 `$` 表示, 例如: `/users/$id/edit.tsx` 将匹配 `/users/123/edit`
- 将路线段括在括号中将使该段成为可选, 例如: `/($lang)/categories.tsx` 将匹配 `/categories`, `/zh/categories`
- 可以使用 `[]` 对路由约定的特殊字符进行转义, 例如: `/make-[$$$]-fast-online.tsx` 将匹配 `/make-$$$-fast-online`
- 以 `_` 为前缀的文件和文件夹变得不可见, 从而允许在不影响路由路径的情况下进行文件夹组织, 例如: `/_legal-pages/privacy-policy.tsx` 将匹配 `/privacy-policy`
- `$.tsx` 泼溅路由将匹配 URL 的其余部分, 包括斜杠, 比如 `/files/$.tsx` 将匹配 `/files`, `/files/one`, `/files/one/two`

> 路由规则大部分和 Remix 的路由兼容, 只是增加了文件夹结构

## Node.js Hono 适配器

将 Remix 应用打包成基于 hono 运行的服务器单文件, 可以使用 pm2 在 VPS 上自主运行

### 需先安装相关依赖

```bash
pnpm add hono @hono/node-server
```

### 配置

编辑 `vite.config.ts` 文件

```ts
import nodeHonoBuild from "@resolid/remix-plugins/node-hono";

export default {
  plugins: [nodeHonoBuild()],
};
```

> 运行 build 以后自动会在 `build/server` 目录下生成 `server.mjs` 和 `package.json` 文件, `package.json` 文件里面定义了 Vite 设置的 `ssr.external`, 在服务器目录下运行 `npm install` 即可安装构建时排除的依赖

## Vercel Serverless 适配器

### 需先安装相关依赖

```bash
pnpm add hono @hono/node-server
```

### 配置

编辑 `vite.config.ts` 文件

```ts
import vercelServerlessBuild from "@resolid/remix-plugins/vercel-serverless";

export default {
  plugins: [
    vercelServerlessBuild({
      // 部署区域
      regions: "sin1",
      // 是否使用清洁 URL
      cleanUrls: true,
      // 需要缓存的 public 目录下文件, 缓存一天, 默认会缓存 favicon.ico
      cacheFiles: ["favicon.svg", "apple-touch-icon.png", "manifest.webmanifest"],
      // 需要缓存的 public 目录下的文件夹, 缓存一年, 默认会缓存 assets
      cacheFolders: ["icons", "images"],
      // Vercel 路由, Remix 的 Server Bundles 功能是并行构建的, 所以插件无法正确写入路由到 Vercel 的 config 文件
      // 需要自己定义路由, path 是路由的路径, dest 是 serverless 的 function name, 规则是 serverBundleId 前加一个下划线
      serverRoutes: [
        { path: "admin", dest: "_admin" },
        { path: "", dest: "_site" },
      ],
    }),
  ],
};
```

> Vercel 项目 Framework Preset 需设置为 Vite, Node.js Version 需设置为 20.x
>
> 如果你使用的是 monorepo 结构, 请设置 Root Directory 为需要部署的项目目录, 然后自定义相关命令, [Resolid](https://github.com/huijiewei/resolid) 的配置如下图
> ![Vercel相关设置](.github/assets/vercel-settings.png)

## 感谢

- [@remix-galaxy/remix-hono-vite](https://github.com/rphlmr/remix-galaxy)
