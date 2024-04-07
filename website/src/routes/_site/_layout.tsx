import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link, Outlet, createPath, useLocation, type Location } from "@remix-run/react";
import { authUtils } from "@resolid/framework/modules";
import {
  Avatar,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuDivider,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
  clsx,
} from "@resolid/react-ui";
import { useTypedLoaderData } from "@resolid/remix-utils";
import { omit, trimEnd } from "@resolid/utils";
import { useState, type MouseEventHandler } from "react";
import { ColorModeToggle } from "~/components/base/ColorModeToggle";
import { HistoryLink, HistoryNavLink } from "~/components/base/HistoryLink";
import { SpriteIcon } from "~/components/base/SpriteIcon";
import { getSessionUser } from "~/foundation/session.server";
import type { UserIdentity } from "~/modules/user/schema.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  return {
    user: await getSessionUser(request),
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
  const { user } = useTypedLoaderData<typeof loader>();

  return (
    <>
      <header className={"z-nav bg-bg-normal sticky top-0 w-full border-b"}>
        <NavBar user={user} />
      </header>
      <div className={"min-h-[calc(100vh-10.765rem)]"}>
        <Outlet />
      </div>
      <footer className={"border-t"}>
        <div className={"text-fg-muted mx-auto flex max-w-6xl flex-col gap-1 p-4 text-center text-sm"}>
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

const NavBar = ({ user }: { user: UserIdentity | undefined }) => {
  const [opened, setOpened] = useState(false);

  return (
    <nav className={"mx-auto flex h-16 items-center justify-between gap-3 px-4 xl:max-w-6xl"}>
      <Link to={"/"} aria-label={"Resolid"}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox={"0 0 600 90"} width="150" height="23">
          <path
            fill="currentColor"
            d="M541.515 88h18.419V55c0-7.2 3.707-12.48 10.883-12.48 7.296 0 11.004 5.04 11.004 12.48v33h18.299V52.72c0-15.12-7.774-25.68-22.605-25.68-7.296 0-13.276 2.64-17.581 8.64V4h-18.419Zm-34.565 1.44c14.83 0 25.595-8.28 29.063-22.8H516.28c-1.674 4.56-4.904 6.96-9.688 6.96-8.013 0-11.123-7.32-11.123-15.36s3.11-15.36 11.123-15.36c4.784 0 8.014 2.4 9.688 6.96h19.734c-3.707-15.84-15.07-22.8-29.063-22.8-18.658 0-30.379 13.08-30.379 31.2 0 18.96 12.439 31.2 30.38 31.2m-64.106 0c15.19 0 25.953-9.6 28.704-21h-19.734c-1.794 3.96-5.023 5.88-9.568 5.88-5.143 0-10.884-3-11.482-11.64h41.86q.36-2.88.36-5.4c0-18.6-12.559-30.24-30.14-30.24-16.984 0-30.498 10.8-30.498 31.2 0 20.52 13.993 31.2 30.498 31.2m-12.08-37.08c1.077-6.36 5.502-10.44 11.84-10.44 6.46 0 11.363 3.96 11.363 10.44ZM400.266 88h9.329V72.28h-6.578c-3.947 0-5.502-1.08-5.502-5.04V43.72h12.08V28.48h-12.08V13.72h-18.419v14.76h-6.219v15.24h6.22V67c0 14.28 7.175 21 21.169 21"
          />
          <path
            fill="#168ef9"
            fillRule="evenodd"
            d="M358.884 89.44c6.339 0 11.481-5.16 11.481-11.4s-5.142-11.4-11.481-11.4c-6.34 0-11.243 5.16-11.243 11.4s4.904 11.4 11.243 11.4"
          />
          <path
            fill="currentColor"
            d="M304.465 89.44c7.774 0 14.591-3 18.658-9.6V88h18.538V4h-18.538v32.28c-3.947-6-11.243-9.24-18.658-9.24-16.624 0-26.671 14.28-26.671 31.08s9.927 31.32 26.671 31.32m5.382-16.2c-8.133 0-13.156-6.72-13.156-15.12 0-10.8 7.176-14.88 13.156-14.88 7.774 0 13.276 6.24 13.276 15 0 9.24-5.86 15-13.276 15M262.844 23.2c6.458 0 11.362-5.16 11.362-11.4S269.302.4 262.844.4c-6.22 0-11.362 5.16-11.362 11.4s5.143 11.4 11.362 11.4m-9.21 64.8h18.42V28.48h-18.42Zm-26.192 0h18.418V4h-18.418Zm-36.479 1.44c18.18 0 31.814-12.24 31.814-31.2 0-18.12-12.558-31.2-31.574-31.2-18.06 0-31.575 12.36-31.575 31.2 0 19.92 13.993 31.2 31.335 31.2m.12-16.08c-7.774 0-12.917-6.24-12.917-15.12 0-9.24 5.502-15 12.917-15 7.057 0 12.917 5.04 12.917 14.88 0 9-5.143 15.24-12.917 15.24m-59.8 16.08c13.156 0 24.518-6.6 24.518-18.48-.36-13.08-10.406-16.08-21.768-18.96-4.305-1.08-11.362-2.04-11.362-6.48 0-3.48 3.23-4.68 6.698-4.68 4.784 0 8.133 2.04 8.97 6.84h17.103c-1.555-13.56-11.482-20.64-25.475-20.64-13.396 0-24.638 6.6-24.638 18.84 0 12.72 10.286 15.6 21.528 18.36 4.067.96 11.482 2.4 11.482 6.6 0 3.48-3.469 4.92-7.296 4.92-4.664 0-8.73-2.52-9.329-7.08h-18.299c.837 13.8 14.83 20.76 27.867 20.76m-61.595 0c15.19 0 25.953-9.6 28.704-21H78.658c-1.794 3.96-5.023 5.88-9.568 5.88-5.143 0-10.884-3-11.482-11.64h41.86q.36-2.88.36-5.4c0-18.6-12.559-30.24-30.14-30.24-16.984 0-30.499 10.8-30.499 31.2 0 20.52 13.994 31.2 30.499 31.2m-12.08-37.08c1.076-6.36 5.502-10.44 11.84-10.44 6.459 0 11.363 3.96 11.363 10.44ZM-.518 88H17.9V60.04c0-9.6 4.426-13.44 13.754-13.44h5.143V27.04c-8.372 0-14.83 4.56-18.897 10.68v-9.24H-.518Z"
          />
        </svg>
      </Link>
      <div
        className={clsx(
          "z-nav bg-bg-normal absolute inset-x-0 top-[calc(theme(spacing.16)+1px)] h-screen p-0",
          "md:relative md:top-0 md:block md:h-auto md:bg-inherit",
          opened ? "block" : "hidden",
        )}
      >
        <NavMenu onClick={() => setOpened(false)} />
      </div>
      <div className={"text-fg-muted inline-flex items-center gap-1"}>
        <NavUser user={user} />
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
              className={({ isActive }) => clsx("hover:text-link-hovered block", isActive && "text-link-pressed")}
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

const NavUser = ({ user }: { user: UserIdentity | undefined }) => {
  const location = useLocation();

  return user ? (
    <DropdownMenu placement={"bottom"}>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} color={"neutral"} size={"sm"} square>
          <Avatar size={24} src={user.avatar} name={authUtils.getDisplayName(user)} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={"text-sm"}>
        <DropdownMenuItem disabled>{user.email}</DropdownMenuItem>
        <DropdownMenuItem asChild>
          <HistoryLink to={`user/${user.username}`}>
            {<SpriteIcon size={"1rem"} name={"user"} className={"me-1.5"} />}个人主页
          </HistoryLink>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <HistoryLink to={"settings"}>
            {<SpriteIcon size={"1rem"} name={"setting"} className={"me-1.5"} />}用户设置
          </HistoryLink>
        </DropdownMenuItem>
        <DropdownMenuDivider />
        <Form action={createPath(getLoginTo("logout", location))} method={"post"}>
          <DropdownMenuItem asChild>
            <button type={"submit"}>{<SpriteIcon size={"1rem"} name={"logout"} className={"me-1.5"} />}退出登陆</button>
          </DropdownMenuItem>
        </Form>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
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
    !location.pathname.endsWith("logout") &&
    !location.pathname.endsWith("password-forgot")
  ) {
    to.search = new URLSearchParams({ redirect: createPath(omit(location, ["hash"])) }).toString();
  }

  return to;
};
