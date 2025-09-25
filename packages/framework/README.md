# @resolid/framework

Resolid 核心框架

- [安装](#安装)
- [设置](#设置)
- [数据库](#数据库)
  - [设置数据库](#设置数据库)
  - [定义数据架构](#定义数据架构)
  - [查询数据](#查询数据)
- [电子邮件](#电子邮件)
  - [基本用法](#基本用法)
  - [自定义 Transport](#自定义-Transport)
- [命令行工具](#命令行工具)
  - [安装依赖](#安装依赖)
  - [增加脚本](#增加脚本)
  - [运行命令](#运行命令)
  - [创建命令](#创建命令)

## 安装

```bash
pnpm add @resolid/framework drizzle-orm react-hook-form react-router zod
```

## 设置

在应用的入口进行框架基础设置

```ts
import { setup } from "@resolid/framework";

setup();
```

## 数据库

### 设置数据库

新建文件 `src/db.server.ts`

```ts
import { defineDatabase } from "@resolid/framework";
import { env } from "node:process";

export const db = defineDatabase({
  dbUrl: "mysql://user:password@host/database", // 数据库链接
  drizzleOptions: {
    logger: process.env.NODE_ENV == "development",
  },
});
```

### 数据表前缀

新建文件 `src/schema.server.ts`

```ts
import { mysqlTableCreator } from "drizzle-orm/mysql-core";

export const defineTable = mysqlTableCreator((name) => "pre_" + name);
```

### 定义数据架构

```js
import { int, varchar, int, timestamp, index, uniqueIndex } from "drizzle-orm/mysql-core";
import { authColumns } from "@resolid/framework/modules";

export const userTable = defineTable(
  "user",
  {
    ...authColumns,
  },
  (table) => [
    uniqueIndex("email").on(table.email),
    uniqueIndex("username").on(table.username),
    index("nickname").on(table.nickname),
    index("groupId").on(table.groupId),
    index("deletedAt").on(table.deletedAt),
  ],
);

export const blogPostTable = defineTable(
  "blog_post",
  {
    id: int().primaryKey().autoincrement(),
    userId: int().notNull().default(0),
    slug: varchar().notNull().default(""),
    title: varchar().notNull().default(""),
    content: text(),
    createdAt: timestamp()
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("slug").on(table.slug),
    index("userId").on(table.userId),
    index("createdAt").on(table.createdAt),
  ],
);

// 建立关联
export const blogPostRelations = relations(blogPostTable, ({ one }) => ({
  user: one(userTable, {
    fields: [blogPostTable.userId],
    references: [userTable.id],
  }),
}));
```

> 更多内容可以查看 https://orm.drizzle.team/docs/column-types/mysql

### 查询数据

```js
import { eq, desc, getTableColumns } from "drizzle-orm/mysql-core";

const posts = db
  .select({
    ...getTableColumns(blogPostTable),
    user: getTableColumns(userTable),
  })
  .from(blogPostTable)
  .where(eq(blogPostTable.userId, 1))
  .orderBy([desc(blogPostTable.createdAt)])
  .leftJoin(userTable, eq(userTable.id, blogPostTable.userId));
```

> 更多内容可以查看 https://orm.drizzle.team/docs/rqb

## 电子邮件

### 基本用法

新建文件 `src/mail.server.ts`

```ts
import { defineMailer } from "@resolid/framework";

export const mailer = defineMailer({
  dsn: "smtp://username:password@host:port", // 邮件服务器设置
  from: "Name <email@example.com>", // 发件人设置,
});
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
import { ResendTransport } from "@documenso/nodemailer-resend";
import { defineMailer } from "@resolid/framework";

export const mailer = defineMailer({
  transport: ResendTransport.makeTransport({
    apiKey: process.env.RESEND_API_KEY || "",
  }),
});
```

> 邮件系统使用 nodemailer 实现, 具体请看: https://www.nodemailer.com/

## 命令行工具

### 安装依赖

命令行工具依赖 `tsx`

```bash
pnpm add -D tsx
```

### 增加脚本

新建 `cli/index.ts` 脚本文件

```ts
import { setup } from "@resolid/framework";
import { createCli } from "@resolid/framework/cli";

setup({
  timezone: "UTC",
});

createCli({
  commands: [],
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

export const demoCommand: CreateCommand = () => {
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

createCli({
  commands: [demoCommand],
});
```

## 感谢

- [remix-utils](https://github.com/sergiodxa/remix-utils)
- [@epic-web/client-hints](https://github.com/epicweb-dev/client-hints)
