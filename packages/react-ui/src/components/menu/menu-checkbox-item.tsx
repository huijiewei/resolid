import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { clsx } from "../../utils/classed";
import { ariaAttr } from "../../utils/dom";
import type { AsChildProps } from "../slot/slot";
import { MenuItem, type MenuItemProps } from "./menu-item";
import { type CheckedState, MenuItemIndicatorProvider } from "./menu-item-indicator-context";

export type MenuCheckboxItemProps = MenuItemProps & {
  checked?: CheckedState;
  onChange?: (checked: CheckedState) => void;
};

export const MenuCheckboxItem = forwardRef<
  HTMLDivElement,
  AsChildProps<"div", MenuCheckboxItemProps, "role" | "tabIndex">
>((props, ref) => {
  const { checked = false, className, onChange, onClick, children, ...rest } = props;

  return (
    <MenuItemIndicatorProvider value={{ checked }}>
      <MenuItem
        ref={ref}
        role="menuitemcheckbox"
        onClick={() => {
          onChange?.(checked == "indeterminate" ? true : !checked);
          onClick?.();
        }}
        aria-checked={checked == "indeterminate" ? "mixed" : ariaAttr(checked)}
        className={clsx("relative pl-6", className)}
        {...rest}
      >
        {children}
      </MenuItem>
    </MenuItemIndicatorProvider>
  );
});

if (__DEV__) {
  MenuCheckboxItem.displayName = "MenuCheckboxItem";
}
