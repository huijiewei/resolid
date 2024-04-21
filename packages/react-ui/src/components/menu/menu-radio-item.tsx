import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { clsx } from "../../utils/classed";
import { ariaAttr } from "../../utils/dom";
import type { AsChildProps } from "../slot/slot";
import { MenuItem, type MenuItemProps } from "./menu-item";
import { MenuItemIndicatorProvider } from "./menu-item-indicator-context";
import { useMenuRadioGroup } from "./menu-radio-group-context";

export type MenuRadioItemProps = MenuItemProps & {
  value: string | number;
};

export const MenuRadioItem = forwardRef<HTMLDivElement, AsChildProps<"div", MenuRadioItemProps, "role" | "tabIndex">>(
  (props, ref) => {
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
            onClick?.();
          }}
          aria-checked={ariaAttr(checked)}
          className={clsx("relative pl-6", className)}
          {...rest}
        >
          {children}
        </MenuItem>
      </MenuItemIndicatorProvider>
    );
  },
);

if (__DEV__) {
  MenuRadioItem.displayName = "MenuRadioItem";
}
