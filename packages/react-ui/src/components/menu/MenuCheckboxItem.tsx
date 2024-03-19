import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { clsx } from "../../utils/classed";
import { ariaAttr } from "../../utils/dom";
import type { AsChildProps } from "../slot/Slot";
import { MenuItem, type MenuItemProps } from "./MenuItem";
import { MenuItemIndicatorProvider, type CheckedState } from "./MenuItemIndicatorContext";

export type MenuCheckboxItemProps = MenuItemProps & {
  checked?: CheckedState;
  onChange?: (checked: CheckedState) => void;
};

export const MenuCheckboxItem = forwardRef<
  HTMLButtonElement,
  AsChildProps<"button", MenuCheckboxItemProps, "type" | "role" | "tabIndex">
>((props, ref) => {
  const { checked = false, className, onChange, onClick, children, ...rest } = props;

  return (
    <MenuItemIndicatorProvider value={{ checked }}>
      <MenuItem
        ref={ref}
        role="menuitemcheckbox"
        onClick={() => {
          onChange?.(checked == "indeterminate" ? true : !checked);
          onClick && onClick();
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
