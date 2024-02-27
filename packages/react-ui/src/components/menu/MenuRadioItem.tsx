import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { clsx } from "../../utils/classed";
import type { AsChildProps } from "../slot/Slot";
import { MenuItem, type MenuItemProps } from "./MenuItem";
import { MenuItemIndicatorProvider } from "./MenuItemIndicatorContext";
import { useMenuRadioGroup } from "./MenuRadioGroupContext";

export type MenuRadioItemProps = MenuItemProps & {
  value: string | number;
};

export const MenuRadioItem = forwardRef<
  HTMLButtonElement,
  AsChildProps<"button", MenuRadioItemProps, "type" | "role" | "tabIndex">
>((props, ref) => {
  const { value, onClick, children, className, ...rest } = props;

  const group = useMenuRadioGroup();
  const checked = value == group.value;

  return (
    <MenuItemIndicatorProvider value={{ checked }}>
      <MenuItem
        ref={ref}
        role="menuitemradio"
        onClick={() => {
          group.onChange?.(value);
          onClick && onClick();
        }}
        aria-checked={checked}
        className={clsx("relative pl-6", className)}
        {...rest}
      >
        {children}
      </MenuItem>
    </MenuItemIndicatorProvider>
  );
});

if (__DEV__) {
  MenuRadioItem.displayName = "MenuRadioItem";
}
