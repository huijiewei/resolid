import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { trimEnd } from "@resolid/utils";
import type { PropsWithChildren } from "react";

import icons from "~/assets/icons/common.svg";
import styles from "~/root.css?url";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: styles,
      precedence: "high",
    },
    {
      rel: "prefetch",
      href: icons,
      as: "image",
      type: "image/svg+xml",
    },
  ];
};

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

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="zh">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0969da" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <Meta />
        <Links />
      </head>
      <body className={"min-h-screen overflow-y-scroll antialiased"}>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export default function Root() {
  return <Outlet />;
}

export const HydrateFallback = () => <p className={"p-20 text-center"}>正在加载</p>;
