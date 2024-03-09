import { MenuCheckboxItem } from "../menu/MenuCheckboxItem";
import { MenuContent } from "../menu/MenuContent";
import { MenuDivider } from "../menu/MenuDivider";
import { MenuGroup } from "../menu/MenuGroup";
import { MenuGroupLabel } from "../menu/MenuGroupLabel";
import { MenuItem } from "../menu/MenuItem";
import { MenuItemIndicator } from "../menu/MenuItemIndicator";
import { MenuItemTrigger } from "../menu/MenuItemTrigger";
import { MenuRadioGroup } from "../menu/MenuRadioGroup";
import { MenuRadioItem } from "../menu/MenuRadioItem";
import { MenuRoot, type MenuProps } from "../menu/MenuRoot";
import { ContextMenuTrigger } from "./ContextMenuTrigger";

export type ContextMenuProps = Omit<MenuProps, "placement" | "lockScroll">;

export const ContextMenu = (props: ContextMenuProps) => {
  return <MenuRoot {...props} lockScroll={true} />;
};

export { ContextMenuTrigger };

export const ContextMenuContent = MenuContent;

export const ContextMenuGroup = MenuGroup;
export const ContextMenuGroupLabel = MenuGroupLabel;

export const ContextMenuItem = MenuItem;
export const ContextMenuItemTrigger = MenuItemTrigger;

export const ContextMenuItemIndicator = MenuItemIndicator;

export const ContextMenuCheckboxItem = MenuCheckboxItem;

export const ContextMenuRadioGroup = MenuRadioGroup;

export const ContextMenuRadioItem = MenuRadioItem;

export const ContextMenuDivider = MenuDivider;
