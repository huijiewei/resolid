import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import { Button, Tooltip, clsx } from "@resolid/react-ui";
import { trimEnd } from "@resolid/utils";
import { useState, type MouseEventHandler } from "react";
import { HistoryLink, HistoryNavLink } from "~/components/base/HistoryLink";
import { SpriteIcon } from "~/components/base/SpriteIcon";

import resolidSvg from "~/assets/images/resolid.svg";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return {
    url: request.url,
  };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const ogImage = new URL("/images/og-image-v1.png", data?.url).toString();
  const ogUrl = trimEnd(new URL("", data?.url).toString(), "/");
  const siteName = "Resolid";
  const title = siteName;
  const description =
    "使用 Remix 驱动的全栈网站，展示使用现代 Web 技术构建高性能、可扩展和用户友好的 Web 应用程序的最佳实践。";

  return [
    { title: title },
    {
      name: "description",
      content: description,
    },
    {
      property: "og:site_name",
      content: siteName,
    },
    {
      property: "og:title",
      content: title,
    },
    {
      property: "og:description",
      content: description,
    },
    {
      property: "og:url",
      content: ogUrl,
    },
    {
      property: "og:image",
      content: ogImage,
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "twitter:title",
      content: title,
    },
    {
      property: "twitter:description",
      content: description,
    },
    {
      property: "twitter:image",
      content: ogImage,
    },
    {
      property: "twitter:url",
      content: ogUrl,
    },
    {
      property: "twitter:card",
      content: "summary_large_image",
    },
  ].filter(Boolean);
};

export default function SiteLayout() {
  return (
    <>
      <header className={"z-nav fixed inset-x-0 w-full border-b bg-bg-normal"}>
        <NavBar />
      </header>
      <div className={"min-h-[calc(100vh-9.55rem)] p-4 pt-16"}>
        <Outlet />
      </div>
      <footer className={"mt-12 border-t py-4 text-center text-sm text-fg-muted"}>
        <p>Released under the MIT License</p>
        <p className={"mt-1"}>
          Proudly made in
          <span className={"mx-1"} aria-label="中国" role="img">
            🇨🇳
          </span>
          by Resolid Tech, 2024
        </p>
        <p className={"mt-1 inline-flex items-center justify-center gap-2 text-[0.813rem]"}>
          <HistoryLink
            to={"status"}
            className={"inline-flex items-center gap-1 rounded bg-bg-success-emphasis px-1.5 py-0.5 text-fg-emphasized"}
          >
            <SpriteIcon size={"0.813rem"} name={"status"} />
            运行状态
          </HistoryLink>
          <span
            className={
              "pointer-events-none inline-flex items-center gap-1 rounded bg-black px-1.5 py-0.5 text-fg-emphasized"
            }
          >
            由 Vercel 部署
          </span>
        </p>
      </footer>
    </>
  );
}

const NavBar = () => {
  const [opened, setOpened] = useState(false);

  return (
    <nav className={"mx-auto flex h-16 items-center justify-between px-4 xl:max-w-6xl"}>
      <Link to={"/"}>
        <img width={150} height={23} alt={"Resolid"} src={resolidSvg} />
      </Link>
      <div className={"inline-flex items-center gap-2"}>
        <div
          className={clsx(
            "z-nav absolute inset-x-0 top-[calc(4rem+1px)] h-screen bg-bg-normal p-0",
            "md:relative md:top-0 md:block md:h-auto md:bg-inherit",
            opened ? "block" : "hidden",
          )}
        >
          <NavMenu onClick={() => setOpened(false)} />
        </div>
        <div className={"inline-flex items-center gap-1 text-fg-muted"}>
          <Tooltip.Root placement={"bottom"}>
            <Tooltip.Trigger asChild>
              <Button aria-label={"用户登录"} color={"neutral"} variant={"ghost"} size={"sm"} square>
                <SpriteIcon name={"user"} />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Tooltip.Arrow />
              用户登录
            </Tooltip.Content>
          </Tooltip.Root>
          <Button aria-label={"颜色模式"} color={"neutral"} variant={"ghost"} size={"sm"} square>
            <SpriteIcon name={"auto"} />
          </Button>
          <Tooltip.Root placement={"bottom"}>
            <Tooltip.Trigger asChild>
              <Button aria-label={"Github 上的 Resolid"} asChild color={"neutral"} variant={"ghost"} size={"sm"} square>
                <a href={"https://github.com/huijiewei/resolid"} target={"_blank"} rel={"noreferrer"}>
                  <SpriteIcon name={"github"} />
                </a>
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Tooltip.Arrow />
              Github 上的 Resolid
            </Tooltip.Content>
          </Tooltip.Root>
          <Button
            aria-label={"导航菜单"}
            color={"neutral"}
            variant={"ghost"}
            size={"sm"}
            square
            className={"md:hidden"}
            onClick={() => setOpened((prev) => !prev)}
          >
            {opened ? <SpriteIcon name={"close"} /> : <SpriteIcon name={"menu"} />}
          </Button>
        </div>
      </div>
    </nav>
  );
};

const NavMenu = ({ onClick }: { onClick?: MouseEventHandler<HTMLAnchorElement> }) => {
  return (
    <ul
      className={clsx(
        "mx-auto flex max-w-xs list-none flex-col p-4 text-center font-medium tracking-widest",
        "md:max-w-none md:flex-row md:p-0 md:tracking-normal",
      )}
    >
      {[
        { name: "主页", href: "", end: true },
        { name: "博客", href: "blog" },
        { name: "论坛", href: "forum" },
        { name: "动弹", href: "tweet" },
        { name: "关于", href: "about" },
      ].map((menu) => {
        return (
          <li key={menu.name}>
            <HistoryNavLink
              className={({ isActive }) =>
                clsx("block p-2.5 hover:text-link-hovered md:px-4", isActive && "text-link-pressed")
              }
              onClick={onClick}
              to={menu.href}
              end={menu.end}
            >
              {menu.name}
            </HistoryNavLink>
          </li>
        );
      })}
    </ul>
  );
};
