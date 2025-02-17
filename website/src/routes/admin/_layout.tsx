import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, tx } from "@resolid/react-ui";
import type { ReactNode } from "react";
import { type LinksFunction, Outlet, type UIMatch, useLoaderData, useMatches } from "react-router";
import { AuthContext } from "~/components/base/auth-provider";
import { ColorModeToggle } from "~/components/base/color-mode-toggle";
import { HistoryLink } from "~/components/base/history-link";
import { ResolidLogo } from "~/components/base/resolid-logo";
import { SpriteIcon } from "~/components/base/sprite-icon";
import { getSessionAdmin } from "~/foundation/session.admin.server";
import type { Route } from "./+types/_layout";

import styles from "~/root.admin.css?url";

// noinspection JSUnusedGlobalSymbols
export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: styles,
      precedence: "high",
    },
  ];
};

// noinspection JSUnusedGlobalSymbols
export const meta = () => {
  return [{ title: "Resolid 后台管理" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  return {
    admin: await getSessionAdmin(request),
  };
};

// noinspection JSUnusedGlobalSymbols
export default function AdminLayout() {
  const { admin } = useLoaderData<typeof loader>();

  return (
    <AuthContext value={{ identity: admin }}>
      <aside className={"fixed bottom-0 top-0 w-56 border-r"}>
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
      <header className={tx("bg-bg-normal fixed left-56 right-0 top-0 z-20 border-b")}>
        <NavBar />
      </header>
      <div className={"bg-bg-subtlest relative ml-56"}>
        <main className={"flex-row p-4 pt-16"}>
          <div className={"bg-bg-normal min-h-[calc(100vh-theme(space.20)-53px)] rounded-md p-4"}>
            <Outlet />
          </div>
        </main>
        <footer className={"flex flex-row items-center justify-between border-t p-4 text-sm"}>
          <div />
          <div>Copyright Ⓒ 2022-present Resolid Tech</div>
        </footer>
      </div>
    </AuthContext>
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
        <BreadcrumbLink className={"gap-0.5"} render={(props) => <HistoryLink {...props} to="/admin" />}>
          <SpriteIcon size={"1em"} name={"home"} />
          后台管理
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
            <BreadcrumbLink className={"gap-0.5"} render={(props) => <HistoryLink {...props} to={breadcrumb.link} />}>
              {breadcrumb.label}
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
      <div className={"text-fg-muted inline-flex items-center gap-1"}>
        <ColorModeToggle />
      </div>
    </nav>
  );
};
