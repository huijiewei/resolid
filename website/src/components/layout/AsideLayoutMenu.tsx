import { clsx } from "@resolid/react-ui";
import { HistoryNavLink } from "~/components/base/HistoryLink";
import { useAsideLayoutDispatch } from "~/components/layout/AsideLayoutContext";

export type Menu = {
  label: string;
  path?: string;
  children?: Menu[];
};

const MenuItem = ({ menu, depth }: { menu: Menu; depth: number }) => {
  const setOpen = useAsideLayoutDispatch();

  return (
    <li>
      {menu.path ? (
        <HistoryNavLink
          className={({ isActive }) => {
            return clsx(
              "block rounded py-1",
              depth == 2 && "ps-4",
              isActive ? "bg-bg-primary" : "hover:bg-bg-subtle active:bg-bg-muted",
            );
          }}
          onClick={() => setOpen(false)}
          to={menu.path}
        >
          {menu.label}
        </HistoryNavLink>
      ) : (
        <h5 className={depth > 1 ? "mb-1 ps-4 font-normal" : "mb-2 font-medium"}>{menu.label}</h5>
      )}
      {menu.children && (
        <ul className={"space-y-1"}>
          {menu.children.map((child) => (
            <MenuItem depth={depth + 1} menu={child} key={child.label} />
          ))}
        </ul>
      )}
    </li>
  );
};

export type AsideLayoutMenuProps = {
  menus: Menu[];
};

export const AsideLayoutMenu = ({ menus }: AsideLayoutMenuProps) => {
  return (
    <ul className={"space-y-3 p-4"}>
      {menus.map((menu) => (
        <MenuItem menu={menu} depth={1} key={menu.label} />
      ))}
    </ul>
  );
};
