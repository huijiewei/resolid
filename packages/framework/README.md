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

新建文件 `src/db.server.ts`

```ts
import { defineDatabase } from "@resolid/framework";
import { env } from "node:process";

export const db = defineDatabase({
  dbUrl: "postgres://user:password@host/database?sslmode=require", // 数据库链接
  drizzleOptions: {
    logger: process.env.NODE_ENV == "development",
  },
});
```

### 数据表前缀

新建文件 `src/schema.server.ts`

```ts
import { pgTableCreator } from "@resolid/framework/drizzle";

export const defineTable = pgTableCreator((name) => "pre_" + name);
```

### 定义数据架构

```js
import { serial, text, integer, relations, pgTable } from "@resolid/framework/drizzle";
import { authColumns } from "@resolid/framework/modules";

export const userTable = pgTable("user", {
    ...authColumns
  },
  (table) => ({
    emailIndex: uniqueIndex().on(table.email),
    usernameIndex: uniqueIndex().on(table.username),
    nicknameIndex: index().on(table.nickname),
    groupIdIndex: index().on(table.groupId),
    deletedAtIndex: index().on(table.deletedAt),
  })
);

export const blogPostTable = pgTable("blog_post", {
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
import { eq, desc, getTableColumns } from "@resolid/framework/drizzle";

const posts = db
  .select({
    ...getTableColumns(blogPostTable),
    user: getTableColumns(userTable)
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
  from: "Name <email@example.com>" // 发件人设置,
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

createCli({
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
  commands: [demoCommand]
});
```

### Drizzle Kit 配置

编辑 `drizzle.config.ts` 文件

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./src/modules/*/schema.server.ts"], // 这里定义本地项目的 schemas
  driver: "pg",
  dbCredentials: {
    connectionString: "" // 数据库连接,
  },
});
```

## 感谢
