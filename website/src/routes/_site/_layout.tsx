import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import { clsx } from "@resolid/react-ui";
import { trimEnd } from "@resolid/utils";
import type { MouseEventHandler } from "react";
import { HistoryNavLink } from "~/components/base/HistoryLink";

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
      <header className={"fixed inset-x-0 z-10 w-full border-b backdrop-blur"}>
        <nav className={"mx-auto flex h-16 items-center justify-between px-4 xl:max-w-6xl"}>
          <Link to={"/"}>
            <img width={150} alt={"Resolid"} src={resolidSvg} />
          </Link>
          <NavMenu />
        </nav>
      </header>
      <div className={"min-h-[calc(100vh-10rem)] p-4 pt-16"}>
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
      </footer>
    </>
  );
}

const NavMenu = ({ onClick }: { onClick?: MouseEventHandler<HTMLAnchorElement> }) => {
  return (
    <ul className={"inline-flex list-none font-medium"}>
      {[
        { name: "主页", href: "", end: true },
        { name: "关于", href: "about" },
      ].map((menu) => {
        return (
          <li key={menu.name}>
            <HistoryNavLink
              className={({ isActive }) =>
                clsx("block p-2 hover:text-link-hovered md:px-4", isActive && "text-link-pressed")
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
