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
import { AuthProvider, useAuth, type AuthContext } from "~/components/base/AuthProvider";
import { ColorModeToggle } from "~/components/base/ColorModeToggle";
import { HistoryLink, HistoryNavLink } from "~/components/base/HistoryLink";
import { ResolidLogo } from "~/components/base/ResolidLogo";
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
    <AuthProvider value={{ identity: user }}>
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
    </AuthProvider>
  );
}

const NavBar = () => {
  const [opened, setOpened] = useState(false);

  return (
    <nav className={"mx-auto flex h-16 items-center justify-between gap-3 px-4 xl:max-w-6xl"}>
      <Link to={"/"} aria-label={"Resolid"}>
        <ResolidLogo />
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
  const { identity: user } = useAuth() as AuthContext<UserIdentity>;

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
