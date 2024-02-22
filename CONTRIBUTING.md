# 贡献指南

感谢你考虑为 Resolid 做出贡献！在提交您的贡献之前，请阅读以下指南。

## 步骤

1. 克隆存储库

   ```bash
   git clone https://github.com/huijiewei/resolid.git
   ```

2. 安装依赖

   ```bash
   pnpm install
   ```

3. 构建 Remix 插件包

   ```bash
   pnpm run --filter @resolid/remix-plugins build
   ```

4. 本地运行
   ```bash
   pnpm run --filter website dev
   ```

## Git 提交规范

对于 Git 提交消息的格式使用良好的规则, 可以使提交历史记录更容易阅读。

### 提交消息格式

Resolid 使用 `commitlint` 工具对提交消息格式进行规范

```
<type>(<scope?>): <summary>

<body?>

<footer?>
```

##### Type 类型

- `feat`: 用于增加新功能
- `fix`: 用于修复 BUG
- `perf`: 用于提高性能的代码更改
- `refactor`: 用于重构代码，和修复 BUG、增加功能、提升性能无关
- `style`: 用于修改代码的样式
- `docs`: 用于修改文档
- `test`: 用于添加、删除、修改代码的测试用例
- `build`: 用于构建系统或外部依赖项的更改
- `chore`: 用于有其他修改，不在上述类型中的修改

##### Scope 范围

范围应该是受影响的包的名称，下面是支持的范围列表：

- `config`
- `react-ui`
- `remix-plugins`
- `remix-utils`
- `tailwind`
- `utils`
- `website`

目前“使用包名称”规则有一些例外：

- `packaging` 用于更改所有包中的 npm 包布局
- `changelog` 用于更新 CHANGELOG.md 中的发行说明

##### Summary 摘要

使用摘要字段提供更改的简洁描述, 如摘要内包含英文的部分，需要两端加入空格

##### Body 正文

在简短描述之后，可以编写较长的提交正文，为代码变更提供额外的上下文信息。正文**必须**起始于描述字段结束的一个空行后。并**可以**使用空行分隔不同段落。

##### Footer 脚注

在正文结束的一个空行之后，可以编写一行或多行脚注。每行脚注都**必须**包含一个令牌（token），后面紧跟 :<space> 或 <space># 作为分隔符，后面再紧跟令牌的值

脚注的令牌**必须**使用 - 作为连字符，比如 Acked-by (这样有助于区分脚注和多行正文)。有一种例外情况就是 `BREAKING CHANGE`，它可以被认为是一个令牌。
