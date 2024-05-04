import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, type UIMatch, useMatches } from "@remix-run/react";
import { useTypedLoaderData } from "@resolid/framework/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  clsx,
  noScrollbarsClassName,
} from "@resolid/react-ui";
import type { ReactNode } from "react";
import { AuthProvider } from "~/components/base/auth-provider";
import { ColorModeToggle } from "~/components/base/color-mode-toggle";
import { HistoryLink } from "~/components/base/history-link";
import { ResolidLogo } from "~/components/base/resolid-logo";
import { SpriteIcon } from "~/components/base/sprite-icon";
import { getSessionAdmin } from "~/foundation/session.admin.server";

import styles from "~/root.admin.css?url";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: styles,
      precedence: "high",
    },
  ];
};

export const meta = () => {
  return [{ title: "Resolid 后台管理" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return {
    admin: await getSessionAdmin(request),
  };
};

export default function AdminLayout() {
  const { admin } = useTypedLoaderData<typeof loader>();

  return (
    <AuthProvider value={{ identity: admin }}>
      <aside className={"fixed top-0 bottom-0 w-56 border-r"}>
        <div className={"flex h-12 items-center justify-center"}>
          <ResolidLogo />
        </div>
        <div className={"scrollbar scrollbar-thin h-full p-4 pb-16 hover:overflow-y-auto"}>
          <p>
            <HistoryLink to={"blog"}>博客管理</HistoryLink>
          </p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单</p>
          <p>菜单1111</p>
        </div>
      </aside>
      <header className={clsx("fixed top-0 right-0 left-56 z-nav border-b bg-bg-normal", noScrollbarsClassName)}>
        <NavBar />
      </header>
      <div className={"relative ml-56 bg-bg-subtlest"}>
        <main className={"flex-row p-4 pt-16"}>
          <div className={"min-h-[calc(100vh-theme(space.20)-53px)] rounded bg-bg-normal p-4"}>
            <Outlet />
          </div>
        </main>
        <footer className={"flex flex-row items-center justify-between border-t p-4 text-sm"}>
          <div>Copyright © 2024</div>
          <div>Proudly made in 🇨 by Resolid Tech</div>
        </footer>
      </div>
    </AuthProvider>
  );
}

const NavBreadcrumb = () => {
  const matches = (
    useMatches() as UIMatch<unknown, { breadcrumb?: (data: unknown) => { link: string; label: ReactNode } }>[]
  ).filter((match) => match.handle?.breadcrumb) as UIMatch<
    unknown,
    { breadcrumb: (data: unknown) => { link: string; label: ReactNode } }
  >[];

  return (
    <Breadcrumb className={"gap-1 text-sm"}>
      <BreadcrumbItem className={"gap-1"}>
        <BreadcrumbLink className={"gap-0.5"} asChild>
          <HistoryLink to="/admin">
            <SpriteIcon size={"1em"} name={"home"} />
            后台管理
          </HistoryLink>
        </BreadcrumbLink>
        <BreadcrumbSeparator />
      </BreadcrumbItem>
      {matches.map((match, index) => {
        const breadcrumb = match.handle.breadcrumb(match.data);
        const key = `b-${index}`;

        if (index == matches.length - 1) {
          return <BreadcrumbItem key={key}>{breadcrumb.label}</BreadcrumbItem>;
        }

        return (
          <BreadcrumbItem key={key} className={"gap-1"}>
            <BreadcrumbLink className={"gap-0.5"} asChild>
              <HistoryLink to={breadcrumb.link}>{breadcrumb.label}</HistoryLink>
            </BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
};

const NavBar = () => {
  return (
    <nav className={"mx-auto flex h-12 items-center justify-between gap-3 px-4"}>
      <div className={"flex flex-row"}>
        <NavBreadcrumb />
      </div>
      <div className={"inline-flex items-center gap-1 text-fg-muted"}>
        <ColorModeToggle />
      </div>
    </nav>
  );
};
