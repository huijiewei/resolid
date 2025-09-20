import { ResolidProvider } from "@resolid/react-ui";
import type { PropsWithChildren } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { RouteProcessBar } from "~/components/base/route-process-bar";
import { VercelAnalytics } from "~/extensions/vercel/VercelAnalytics";
import { VercelSpeedInsights } from "~/extensions/vercel/VercelSpeedInsights";
import { requestIdMiddleware } from "~/middlewares/request-id.server";

// noinspection JSUnusedGlobalSymbols
export const middleware = [requestIdMiddleware];

// noinspection JSUnusedGlobalSymbols
export const Layout = ({ children }: PropsWithChildren) => {
  // noinspection HtmlRequiredTitleElement
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
      <body className={"min-h-screen overflow-y-scroll"}>
        <RouteProcessBar />
        <ResolidProvider>{children}</ResolidProvider>
        <ScrollRestoration />
        <Scripts />
        {!!import.meta.env.VITE_VERCEL_URL && (
          <>
            <VercelAnalytics endpoint={"/growth"} scriptSrc={"/growth/script.js"} />
            <VercelSpeedInsights endpoint={"/speed-growth/vitals"} scriptSrc={"/speed-growth/script.js"} />
          </>
        )}
      </body>
    </html>
  );
};

// noinspection JSUnusedGlobalSymbols
export default function Root() {
  return <Outlet />;
}
