# @resolid/framework

Resolid 核心框架

- [数据库](#数据库设置)
  * [设置数据库](#设置数据库)
  * [定义数据架构](#定义数据架构)
  * [查询数据](#查询数据)
- [电子邮件](#电子邮件)
  * [基本用法](#基本用法)
  * [自定义 Transport](#自定义-Transport)
- [命令行工具](#命令行工具)
  * [安装依赖](#安装依赖)
  * [增加脚本](#增加脚本)
  * [运行命令](#运行命令)
  * [创建命令](#创建命令)
  * [Drizzle Kit 配置](#Drizzle-Kit-配置)
- [单元测试](#单元测试)

## 数据库

### 设置数据库

修改环境变量文件 `.env`

```text
# 数据库连接
RX_DB_URL=''
# 表前缀
RX_DB_TABLE_PREFIX='rx_'
```

新建文件 `src/db.server.ts`

```ts
import { defineDatabase } from "@resolid/framework";
import { env } from "node:process";

export const db = defineDatabase({
  drizzleOptions: {
    logger: process.env.NODE_ENV == "development",
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
 
## 电子邮件

### 基本用法

修改环境变量文件 `.env`

```text
# 邮件服务设置
RX_MAILER_DSN='smtp://username:password@host:port'
RX_MAILER_FROM='Name <email@example.com>'
```

新建文件 `src/mail.server.ts`

```ts
import { defineMailer } from "@resolid/framework";

export const mailer = defineMailer();
```

发送邮件
```ts
await mailer.send({
  to: "收件人 <邮箱>",
  subject: "标题",
  text: "内容",
});
```

### 自定义 Transport

你可以设定自定义的 Transport, 设置环境变量 `RX_MAILER_DSN` 为 `custom`, 然后将 Transport 传输给 `defineMailer`

```ts
import { ResendTransport } from '@documenso/nodemailer-resend';
import { defineMailer } from "@resolid/framework";

export const mailer = defineMailer({
  transport: ResendTransport.makeTransport({
    apiKey: process.env.RESEND_API_KEY || '',
  }),
});
```

> 邮件系统使用 nodemailer 实现, 具体请看: https://www.nodemailer.com/

## 命令行工具

### 安装依赖

命令行工具依赖 `drizzle-kit` 和 `tsx`

```bash
pnpm add -D drizzle-kit tsx
```

### 增加脚本

新建 `cli/index.ts` 脚本文件

```ts
import { createCli } from "@resolid/framework/cli";
import { db } from "../src/db.server";

createCli({
  db: db,
  commands: []
});
```

在 `package.json` 的 `scripts` 里面增加

```text
"resolid": "node --import tsx/esm --env-file .env ./cli/index.ts"
```

### 运行命令

```shell
pnpm run resolid
```

### 创建命令

新建 `cli/commands/demo.ts` 文件

```ts
import { Command, type CreateCommand } from "@resolid/framework/cli";

export const demoCommand : CreateCommand = () => {
  const demo = new Command("demo");

  demo.description("命令演示");

  demo
    .command("echo")
    .description("演示输出")
    .action(() => {
      console.log("这是一个演示命令");
    });

  return demo;
};
```

> Command 是 commander 的再导出, 具体请看 https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md

编辑 `cli/index.ts` 脚本文件

```ts
import { createCli } from "@resolid/framework/cli";
import { demoCommand } from "./commands/demo";
import { db } from "../src/db.server";

createCli({
  db: db,
  commands: [demoCommand]
});
```

### Drizzle Kit 配置

编辑 `drizzle.config.ts` 文件

```ts
import { drizzleKitConfig } from "@resolid/framework";

export default drizzleKitConfig({
  schema: ["./src/modules/*/schema.server.ts"], // 这里定义本地项目的 schema
});
```

## 单元测试

新建文件 `.env.test`

```text
# 数据库连接
RX_DB_URL=''
# 表前缀
RX_DB_TABLE_PREFIX='rx_'
```

修改文件 `vite.config.ts` 或者 `vitest.config.ts` 加载测试环境变量
```ts
import { loadEnv, defineConfig } from "vite";

export default defineConfig({
  test: {
    env: loadEnv("test", cwd(), ""),
  }
});
```

## 感谢
