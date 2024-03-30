import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, Outlet, createPath, useLocation, type Location } from "@remix-run/react";
import { Badge, Button, Tooltip, TooltipArrow, TooltipContent, TooltipTrigger, clsx } from "@resolid/react-ui";
import { omit, trimEnd } from "@resolid/utils";
import { useState, type MouseEventHandler } from "react";
import { ColorModeToggle } from "~/components/base/ColorModeToggle";
import { HistoryLink, HistoryNavLink } from "~/components/base/HistoryLink";
import { SpriteIcon } from "~/components/base/SpriteIcon";

import resolidSvg from "~/assets/images/resolid.svg";

export const loader = ({ request, context }: LoaderFunctionArgs) => {
  return {
    requestOrigin: context.requestOrigin ?? request.url,
  };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const ogImage = new URL("/images/og-image-v1.png", data?.requestOrigin).toString();
  const ogUrl = trimEnd(new URL("", data?.requestOrigin).toString(), "/");
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
      <header className={"sticky top-0 z-nav w-full border-b bg-bg-normal"}>
        <NavBar />
      </header>
      <div className={"min-h-[calc(100vh-10.765rem)]"}>
        <Outlet />
      </div>
      <footer className={"border-t"}>
        <div className={"mx-auto flex max-w-6xl flex-col gap-1 p-4 text-center text-sm text-fg-muted"}>
          <p>Released under the MIT License</p>
          <p>
            Proudly made in
            <span className={"mx-1"} aria-label="中国" role="img">
              🇨🇳
            </span>
            by Resolid Tech, 2024
          </p>
          <p className={"inline-flex items-center justify-center gap-2"}>
            <Badge asChild color={"success"}>
              <HistoryLink to={"status"}>
                <SpriteIcon className={"me-1"} size={"xs"} name={"status"} />
                运行状态
              </HistoryLink>
            </Badge>
            <Badge className={"pointer-events-none"} color={"neutral"}>
              由 Vercel 部署
            </Badge>
          </p>
        </div>
      </footer>
    </>
  );
}

const NavBar = () => {
  const [opened, setOpened] = useState(false);

  return (
    <nav className={"mx-auto flex h-16 items-center justify-between gap-3 px-4 xl:max-w-6xl"}>
      <Link to={"/"}>
        <img width={150} height={23} alt={"Resolid"} src={resolidSvg} />
      </Link>
      <div
        className={clsx(
          "absolute inset-x-0 top-[calc(theme(spacing.16)+1px)] z-nav h-screen bg-bg-normal p-0",
          "md:relative md:top-0 md:block md:h-auto md:bg-inherit",
          opened ? "block" : "hidden",
        )}
      >
        <NavMenu onClick={() => setOpened(false)} />
      </div>
      <div className={"inline-flex items-center gap-1 text-fg-muted"}>
        <NavUser />
        <ColorModeToggle />
        <Tooltip placement={"bottom"}>
          <TooltipTrigger asChild>
            <Button aria-label={"Github 上的 Resolid"} asChild color={"neutral"} variant={"ghost"} size={"sm"} square>
              <a href={"https://github.com/huijiewei/resolid"} target={"_blank"} rel={"noreferrer"}>
                <SpriteIcon name={"github"} />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <TooltipArrow />
            Github 上的 Resolid
          </TooltipContent>
        </Tooltip>
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
        { name: "组件", href: "ui" },
        { name: "关于", href: "about" },
      ].map((menu) => {
        return (
          <li className={"p-2.5 md:px-4"} key={menu.name}>
            <HistoryNavLink
              className={({ isActive }) => clsx("block hover:text-link-hovered", isActive && "text-link-pressed")}
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

const NavUser = () => {
  const location = useLocation();

  return (
    <Tooltip placement={"bottom"}>
      <TooltipTrigger asChild>
        <Button asChild aria-label={"用户登录"} color={"neutral"} variant={"ghost"} size={"sm"} square>
          <HistoryLink to={getLoginTo("login", location)}>
            <SpriteIcon name={"user"} />
          </HistoryLink>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <TooltipArrow />
        用户登录
      </TooltipContent>
    </Tooltip>
  );
};

const getLoginTo = (pathname: string, location: Location) => {
  const to = {
    pathname: pathname,
    search: location.search,
  };

  if (
    !location.pathname.endsWith("login") &&
    !location.pathname.endsWith("signup") &&
    !location.pathname.endsWith("forgot-password")
  ) {
    to.search = new URLSearchParams({ redirect: createPath(omit(location, ["hash"])) }).toString();
  }

  return to;
};
