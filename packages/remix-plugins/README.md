# @resolid/remix-plugins

[简体中文](README.zh_CN.md)

Resolid Remix extension package, mainly some plug-ins to enhance Remix and needs to be used with Vite

## Feature

- [Routing Enhancement](#routing-enhancement)
- [Hono Server](#hono-server)
  - [Node.js Serve](#nodejs-serve)
  - [Dev Server](#dev-server)
  - [Vercel Serve](#vercel-serve)
  - [Hono Middleware](#hono-middleware)
  - [Remix Load Context](#remix-load-context)

## Install

```bash
pnpm add -D @resolid/remix-plugins
```

### Routing Enhancement

Remix uses flat file routing by default, using `.` to split URLs. This method is fine for small projects, but it is not
comfortable once it encounters large projects, so I developed a routing system that mixes directories and files.

#### Configuration

Edit `vite.config.ts` file

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

#### Router Rules

- Routes are defined and nested using folders, very similar to how HTML files are laid out on the nginx server
- The `_layout` file wraps all downstream routes, which require an `<Outlet />` to render sub-routes
- The `_index` file is the default file for the folder, for example: `/users/_index.tsx` will match `/users`
- Variables are represented by `$` in the file path, for example: `/users/$id/edit.tsx` will match `/users/123/edit`
- Enclosing a route segment in parentheses will make the segment optional, for example: `/($lang)/categories.tsx` will
  match `/categories`, `/zh/categories`
- You can use `[]` to escape special characters in routing conventions, for example: `/make-[$$$]-fast-online.tsx` will
  match `/make-$$$-fast-online`
- Files and folders prefixed with `_` become invisible, allowing folder organization without affecting routing paths,
  for example: `/_legal-pages/privacy-policy.tsx` will match `/ privacy-policy`
- `$.tsx` splash route will match the rest of the URL, including slashes, e.g. `/files/$.tsx` will match `/files`,
  `/files/one`, `/files/one/two `

> Most of the routing rules are compatible with Remix's routing, but the folder structure is added

## Hono Server

### Install related dependencies

```bash
pnpm add hono @hono/node-server
```

### Node.js Serve

#### Create Node.js Server

```ts
// app/server.node.ts

import { createHonoNodeServer } from "@resolid/remix-plugins/node-server";

export const server = await createHonoNodeServer();
```

#### Config Node.js Preset in Remix Plugin

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
          // Entry file
          entryFile: "server.node.ts" // default is server.ts
        })
      ]
    }),
    tsconfigPaths()
  ]
});
```

Supports the `SERVER_PORT` and `SERVER_PATH` environment variables. The `SERVE_PATH` environment variable is
for Remix's serverBundles feature.

> After running build, `server.mjs` and `package.json` files will be automatically generated in the `build/server`
> directory. The `package.json` file defines the `ssr.external` set by Vite in the server directory. Run `npm install`
> to
> install dependencies excluded during build

### Dev Server

Edit vite.config.ts to config dev server

```ts
// vite.config.ts

import { vitePlugin as remix } from "@remix-run/dev";
import { devServer } from "@resolid/remix-plugins/dev-server";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    devServer({
      // Entry file
      entryFile: "server.node.ts"  // default is server.ts
    }),
    remix(),
    tsconfigPaths()
  ]
});
```

Edit package.json dev run scripts, use vite

```json lines
// package.json
{
  "scripts": {
    "dev": "vite"
  }
  // ...
}
```

### Vercel Serve

> You can use https://github.com/huijiewei/remix-vite-vercel-template to quick start deploy to vercel.

#### Create Vercel server

```ts
// app/server.vercel.ts

import { createHonoVercelServer } from "@resolid/remix-plugins/vercel-server";

export const server = await createHonoVercelServer();

export default server;
```

##### Config Vercel Preset in Remix Plugin

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
          // Deployment area
          regions: "sin1",
          // Some packages will introduce binary packages according to different platforms. The binary packages are not in the same directory during installation, such as @node-rs/bcrypt
          copyParentModules: ["@node-rs/bcrypt"],
          // Entry file
          entryFile: "server.vercel.ts" // 默认为 server.ts
        })
      ]
    }),
    tsconfigPaths()
  ]
});
```

> Vercel project Framework Preset needs to be set to Vite, Node.js Version needs to be set to 20.x
>
> If you are using a monorepo structure, please set the Root Directory to the project directory that needs to be
> deployed, and then customize the relevant commands. The configuration
> of [Resolid](https://github.com/huijiewei/resolid)
> is as shown below
> ![Vercel related settings](.github/assets/vercel-settings.png)

### Hono Middleware

Middleware are functions that are called before Remix calls your loader/action. See the [Hono docs](https://hono.dev/docs/guides/middleware) for more information.

You can use configure option in createHonoNodeServer or createHonoVercelServer to use Hono middleware

```ts
import { createHonoNodeServer } from "@resolid/remix-plugins/node-server";

export const server = await createHonoNodeServer({
  configure: (server) => {
    server.use(/* Hono Middleware */);
  }
});
```

### Remix load context

If you'd like to add additional properties to the load context, you can config getLoadContext option in createHonoNodeServer or createHonoVercelServer to augmenting load context.

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

## Acknowledgment

- [@hono/vite-dev-server](https://github.com/honojs/vite-plugins/tree/main/packages/dev-server)
- [@remix-galaxy/remix-hono-vite](https://github.com/rphlmr/remix-galaxy)
