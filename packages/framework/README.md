# @resolid/framework

Resolid 核心框架

## 基本用法

### 设置数据库

新建文件 `src/db.server.ts`

```ts
import { defineDatabase } from "@resolid/framework";
import { env } from "node:process";

export const db = defineDatabase({
  drizzleOptions: {
    logger: env.NODE_ENV == "development",
  },
});
```

需要给 `vite.config.ts` 增加 `alias` 配置, 让核心框架能访问到刚才定义的 `db`

```
{
  find: "@dbInstance",
  replacement: fileURLToPath(new URL(`./src/db.server.ts`, import.meta.url)),
}
```

### 定义数据架构

```js
import { defineTable } from "@resolid/framework";
import { userTable } from "@resolid/framework/modules";
import { serial, text, integer, relations } from "@resolid/framework/drizzle";

// 定义博客文章, 请使用 defineTable 定义
export const blogPostTable = defineTable("blog_post", {
    id: serial("id").primaryKey(),
    userId: integer("userId").notNull().default(0),
    slug: text("slug").notNull().default(""),
    title: text("title").notNull().default(""),
    content: text("content").notNull().default(""), 
    createdAt: timestamp("createdAt").notNull().defaultNow()
  },
  (blogPostTable) => ({
    slugIndex: uniqueIndex("slugIndex").on(blogPostTable.slug),
    userIdIndex: index("userIdIndex").on(blogPostTable.userId),
    createdAtIndex: index("createdAtIndex").on(blogPostTable.createdAt)
  })
);

// 建立关联
export const blogPostRelations = relations(blogPostTable, ({ one }) => ({
  user: one(userTable, {
    fields: [blogPostTable.userId],
    references: [userTable.id]
  })
}));
```

> 更多内容可以查看 https://orm.drizzle.team/docs/column-types/pg

### 查询数据

```js
import { eq } from "@resolid/framework/drizzle";

const posts = db.query.blogPostTable
  .findMany({
    where: eq(blogPostTable.userId, 1),
    orderBy: [desc(blogPostTable.createdAt)],
    with: {
      user: true,
    },
  });
```

> 更多内容可以查看 https://orm.drizzle.team/docs/rqb

## 命令行工具

命令行工具依赖 `drizzle-kit`

```bash
pnpm add -D drizzle-kit
```

编辑 `drizzle.config.ts` 文件

```ts
import { drizzleKitConfig } from "@resolid/framework";

export default drizzleKitConfig({
  schema: ["./src/modules/*/schema.server.ts"], // 这里定义本地项目的 schema
});
```

### 数据库 Push

```shell
resolid db push
```

## 单元测试

增加 .env.test 文件

```text
# 数据库连接
RX_DB_URL=''
# 表前缀
RX_DB_TABLE_PREFIX='rx_'
```

## 感谢
