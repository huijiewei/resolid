# @resolid/framework

Resolid 核心框架

本框架依赖 `drizzle-orm`, 所以要使用需先安装

### 定义数据库

新建文件 `src/db.server.ts`

```ts
import { resolidDatabase } from "@resolid/framework";
import { env } from "node:process";

export const db = resolidDatabase({
  drizzleOptions: {
    logger: env.NODE_ENV == "development",
  },
});
```

需要给 `vite.config.ts` 增加 `alias` 配置, 让核心框架能访问到刚才定义的 `db`

```
{
  find: "@dbInstance",
  replacement: fileURLToPath(new URL(`./src/database.ts`, import.meta.url)),
}
```

如果需要使用 `drizzle-kit` 命令来进行数据库 `push`, 需要修改 `drizzle.config.ts` 文件

```ts
export default {
  // 在 schema 里面增加很核心库的 schema
  schema: ["./node_modules/@resolid/framework/src/schemas.ts"],
  driver: "pg",
  dbCredentials: {
    connectionString: env.RX_DB_URL,
  },
};
```

## 感谢
