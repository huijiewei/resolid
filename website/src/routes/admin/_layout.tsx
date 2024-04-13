import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { Button, clsx, noScrollbarsClassName } from "@resolid/react-ui";
import { useTypedLoaderData } from "@resolid/remix-utils";
import { useState } from "react";
import { AuthProvider } from "~/components/base/AuthProvider";
import { ColorModeToggle } from "~/components/base/ColorModeToggle";
import { ResolidLogo } from "~/components/base/ResolidLogo";
import { SpriteIcon } from "~/components/base/SpriteIcon";
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
  return [{ title: "Resolid 管理面板" }];
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
      <aside className={"fixed bottom-0 top-0 w-56 border-r"}>
        <div className={"flex h-16 items-center justify-center"}>
          <ResolidLogo />
        </div>
      </aside>
      <header className={clsx("fixed left-56 right-0 top-0 z-nav border-b bg-bg-normal", noScrollbarsClassName)}>
        <NavBar />
      </header>
      <div className={"relative ml-56 flex min-h-screen flex-col bg-bg-subtlest"}>
        <main className={"grow p-4 pt-20"}>
          <div className={"rounded bg-bg-normal p-4"}>
            <Outlet />
          </div>
        </main>
        <footer className={"flex flex-row items-center justify-between border-t p-4 text-sm"}>
          <div>Copyright © 2024</div>
          <div>Proudly made in 🇨🇳 by Resolid Tech</div>
        </footer>
      </div>
    </AuthProvider>
  );
}

const NavBar = () => {
  const [opened, setOpened] = useState(false);

  return (
    <nav className={"mx-auto flex h-16 items-center justify-between gap-3 px-4"}>
      <div
        className={clsx(
          "absolute inset-x-0 top-[calc(theme(spacing.16)+1px)] z-nav h-screen bg-bg-normal p-0",
          "md:relative md:top-0 md:block md:h-auto md:bg-inherit",
          opened ? "block" : "hidden",
        )}
      ></div>
      <div className={"inline-flex items-center gap-1 text-fg-muted"}>
        <ColorModeToggle />
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
