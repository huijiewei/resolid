import { MenuCheckboxItem } from "../menu/menu-checkbox-item";
import { MenuContent } from "../menu/menu-content";
import { MenuDivider } from "../menu/menu-divider";
import { MenuGroup } from "../menu/menu-group";
import { MenuItem } from "../menu/menu-item";
import { MenuItemIndicator } from "../menu/menu-item-indicator";
import { MenuItemTrigger } from "../menu/menu-item-trigger";
import { MenuLabel } from "../menu/menu-label";
import { MenuRadioGroup } from "../menu/menu-radio-group";
import { MenuRadioItem } from "../menu/menu-radio-item";
import { MenuRoot, type MenuRootProps } from "../menu/menu-root";
import { ContextMenuTrigger } from "./context-menu-trigger";

export type ContextMenuProps = Omit<MenuRootProps, "placement" | "lockScroll" | "trigger" | "syncWidth">;

export const ContextMenu = (props: ContextMenuProps) => {
  return <MenuRoot {...props} lockScroll={true} syncWidth={false} />;
};

export { ContextMenuTrigger };

export const ContextMenuContent = MenuContent;

export const ContextMenuGroup = MenuGroup;
export const ContextMenuLabel = MenuLabel;

export const ContextMenuItem = MenuItem;
export const ContextMenuItemTrigger = MenuItemTrigger;

export const ContextMenuItemIndicator = MenuItemIndicator;

export const ContextMenuCheckboxItem = MenuCheckboxItem;

export const ContextMenuRadioGroup = MenuRadioGroup;

export const ContextMenuRadioItem = MenuRadioItem;

export const ContextMenuDivider = MenuDivider;
