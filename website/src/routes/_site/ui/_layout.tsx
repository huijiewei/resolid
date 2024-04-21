import { Outlet } from "@remix-run/react";
import { mergeMeta } from "@resolid/framework/utils";
import { CloseButton, clsx } from "@resolid/react-ui";
import { useState } from "react";
import { SpriteIcon } from "~/components/base/sprite-icon";
import { AsideLayoutDispatchProvider, AsideLayoutStateProvider } from "~/components/layout/aside-layout-context";
import { AsideLayoutMenu, type Menu } from "~/components/layout/aside-layout-menu";

export const meta = mergeMeta(() => {
  return [
    {
      title: "组件库",
    },
  ];
});

export default function Layout() {
  const [opened, setOpened] = useState(false);

  return (
    <AsideLayoutDispatchProvider value={setOpened}>
      <AsideLayoutStateProvider value={opened}>
        <div className={"mx-auto flex xl:max-w-6xl"}>
          <div
            className={
              "fixed z-aside flex h-9 w-full items-center justify-between border-b bg-bg-normal px-2 text-sm md:hidden"
            }
          >
            <button type={"button"} onClick={() => setOpened(true)} className={"flex items-center gap-1 p-2"}>
              <SpriteIcon size={"xs"} name={"menu"} />
              <span>导航</span>
            </button>
          </div>
          <aside
            className={clsx(
              "fixed z-aside w-48 border-r bg-bg-normal md:z-none md:block md:border-none",
              "overflow-y-auto scrollbar scrollbar-base",
              "max-h-[calc(100vh-theme(spacing.16))] md:sticky md:top-16",
              opened ? "block" : "hidden",
            )}
          >
            <nav className={"pb-28 text-sm md:pb-0"}>
              <CloseButton onClick={() => setOpened(false)} className={"absolute end-2 top-2 p-1 md:hidden"} />
              <AsideLayoutMenu menus={menus} />
            </nav>
          </aside>
          <main className={"flex w-full grow pt-9 md:max-w-[calc(100%-theme(spacing.48))] md:pt-0"}>
            <Outlet />
          </main>
        </div>
      </AsideLayoutStateProvider>
    </AsideLayoutDispatchProvider>
  );
}

const menus: Menu[] = [
  {
    label: "概述",
    children: [
      {
        label: "介绍",
        path: "introduction",
      },
      {
        label: "入门指南",
        path: "getting-started",
      },
      {
        label: "主题设置",
        path: "theming",
      },
    ],
  },
  {
    label: "通用组件",
    children: [
      {
        label: "按钮",
        path: "components/button",
      },
      {
        label: "图标",
        path: "components/icon",
      },
      {
        label: "图片",
        path: "components/image",
      },
      {
        label: "排版",
        path: "components/typography",
      },
    ],
  },
  {
    label: "布局",
    children: [
      {
        label: "布局",
        path: "components/layout",
      },
      {
        label: "弹性布局",
        path: "components/flex",
      },
      {
        label: "网格",
        path: "components/grid",
      },
      {
        label: "表格",
        path: "components/table",
      },
      {
        label: "分割线",
        path: "components/divider",
      },
    ],
  },
  {
    label: "数据展示",
    children: [
      {
        label: "头像",
        path: "components/avatar",
      },
      {
        label: "徽标",
        path: "components/badge",
      },
      {
        label: "折叠面板",
        path: "components/collapsible",
      },
    ],
  },
  {
    label: "数据输入",
    children: [
      {
        label: "输入框",
        path: "components/input",
      },
      {
        label: "数字输入框",
        path: "components/number-input",
      },
      {
        label: "选择器",
        path: "components/select",
      },
      {
        label: "滑动输入条",
        path: "components/slider",
      },
      {
        label: "复选框",
        path: "components/checkbox",
      },
      {
        label: "单选框",
        path: "components/radio",
      },
      {
        label: "开关",
        path: "components/switch",
      },
    ],
  },
  {
    label: "交互反馈",
    children: [
      {
        label: "警告提示",
        path: "components/alert",
      },
      {
        label: "通知提醒",
        path: "components/toast",
      },
      {
        label: "工具提示",
        path: "components/tooltip",
      },
      {
        label: "弹出框",
        path: "components/popover",
      },
      {
        label: "模态框",
        path: "components/modal",
      },
      {
        label: "抽屉",
        path: "components/drawer",
      },
      {
        label: "进度条",
        path: "components/progress-bar",
      },
      {
        label: "加载器",
        path: "components/spinner",
      },
      {
        label: "覆盖层",
        path: "components/overlay",
      },
      {
        label: "加载覆盖层",
        path: "components/spinner-overlay",
      },
    ],
  },
  {
    label: "页面导航",
    children: [
      {
        label: "面包屑",
        path: "components/breadcrumb",
      },
      {
        label: "分页",
        path: "components/pagination",
      },
      {
        label: "下拉菜单",
        path: "components/dropdown-menu",
      },
      {
        label: "右键菜单",
        path: "components/context-menu",
      },
    ],
  },
];
