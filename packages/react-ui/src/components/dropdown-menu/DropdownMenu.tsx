import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { FloatingArrow } from "../floating/FloatingArrow";
import { FloatingTrigger, type FloatingTriggerProps } from "../floating/FloatingTrigger";
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

export type DropdownMenuProps = MenuProps;

export const DropdownMenu = MenuRoot;

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

export const DropdownMenuGroupLabel = MenuGroupLabel;

export const DropdownMenuItem = MenuItem;

export const DropdownMenuItemTrigger = MenuItemTrigger;

export const DropdownMenuItemIndicator = MenuItemIndicator;

export const DropdownMenuCheckboxItem = MenuCheckboxItem;

export const DropdownMenuRadioGroup = MenuRadioGroup;

export const DropdownMenuRadioItem = MenuRadioItem;
