import type { LinksFunction } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { ColorModeScript, ResolidProvider } from "@resolid/react-ui";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/remix";
import type { PropsWithChildren } from "react";
import { RouteProcessBar } from "~/components/base/RouteProcessBar";

import styles from "~/root.css?url";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: styles,
      precedence: "high",
    },
  ];
};

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0969da" />
        <link rel="manifest" href="/manifest.webmanifest" crossOrigin="use-credentials" />
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <Meta />
        <Links />
      </head>
      <body className={"min-h-screen overflow-y-scroll antialiased"}>
        <RouteProcessBar />
        <ResolidProvider>{children}</ResolidProvider>
        <ScrollRestoration />
        <Scripts />
        <ColorModeScript />
      </body>
    </html>
  );
};

export default function Root() {
  return (
    <>
      {!!import.meta.env.VITE_VERCEL_URL && (
        <>
          <Analytics endpoint={"/growth"} scriptSrc={"/growth/script.js"} />
          <SpeedInsights endpoint={"/speed-growth/vitals"} scriptSrc={"/speed-growth/script.js"} />
        </>
      )}
      <Outlet />
    </>
  );
}

export const HydrateFallback = () => <p className={"p-20 text-center"}>正在加载</p>;
