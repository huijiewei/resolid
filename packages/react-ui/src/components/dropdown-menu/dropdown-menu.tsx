import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { FloatingArrow } from "../floating/floating-arrow";
import { FloatingTrigger, type FloatingTriggerProps } from "../floating/floating-trigger";
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

export type DropdownMenuProps = Omit<MenuRootProps, "lockScroll">;

export const DropdownMenu = (props: DropdownMenuProps) => {
  return <MenuRoot {...props} />;
};

export const DropdownMenuTrigger = forwardRef<HTMLButtonElement, Omit<FloatingTriggerProps, "active">>((props, ref) => (
  <FloatingTrigger ref={ref} active={true} {...props} />
));

if (__DEV__) {
  DropdownMenuTrigger.displayName = "DropdownMenuTrigger";
}

export const DropdownMenuContent = MenuContent;

export const DropdownMenuArrow = FloatingArrow;

export const DropdownMenuDivider = MenuDivider;

export const DropdownMenuGroup = MenuGroup;

export const DropdownMenuLabel = MenuLabel;

export const DropdownMenuItem = MenuItem;

export const DropdownMenuItemTrigger = MenuItemTrigger;

export const DropdownMenuItemIndicator = MenuItemIndicator;

export const DropdownMenuCheckboxItem = MenuCheckboxItem;

export const DropdownMenuRadioGroup = MenuRadioGroup;

export const DropdownMenuRadioItem = MenuRadioItem;
