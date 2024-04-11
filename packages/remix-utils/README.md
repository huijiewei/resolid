# @resolid/remix-utils

Resolid Remix 增强工具包

## 安装

```bash
pnpm add @resolid/remix-utils
```

## Meta 合并工具

### 使用

```ts
import { mergeMeta } from "@resolid/remix-utils";

export const meta = mergeMeta(
  /// 原 Remix MetaFunction
  () => {
    return [{ title: "关于" }];
  },
  // Title 合并连接字符串
  " - ",
);
```

> 本工具会自动覆盖或者附加到上级路由定义的 Meta, 只有 title 会使用合并连接字符串连接

## 致谢
