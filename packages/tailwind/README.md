# @resolid/tailwind

Resolid TailwindCSS 预设

## 安装

```bash
pnpm add -D @resolid/tailwind
```

## 添加 Tailwind CSS 预设

编辑 `tailwindcss` 配置文件

```ts
import resolidTailwind from "@resolid/tailwind";

export default {
  presets: [resolidTailwind.preset()],
  theme: {},
};
```

## 感谢

- [tw-colors](https://github.com/L-Blondy/tw-colors)
