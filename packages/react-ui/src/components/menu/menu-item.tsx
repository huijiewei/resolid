import { __DEV__ } from "@resolid/utils";
import { forwardRef, type KeyboardEvent } from "react";
import type { AsChildProps } from "../slot/slot";
import { useMenuSelect } from "./menu-context";
import { MenuItemImpl, type MenuItemImplProps } from "./menu-item-impl";

export type MenuItemProps = MenuItemImplProps & {
  onClick?: () => void;
};

export const MenuItem = forwardRef<HTMLDivElement, AsChildProps<"div", MenuItemProps, "tabIndex">>((props, ref) => {
  const { asChild, className, disabled = false, children, onClick, ...rest } = props;

  const { tree } = useMenuSelect();

  const handleClick = () => {
    if (disabled) {
      return;
    }

    onClick?.();
    tree?.events.emit("click");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) {
      return;
    }

    if (event.key == " " || event.key == "Enter") {
      event.preventDefault();
      event.stopPropagation();
      handleClick();
    }
  };

  return (
    <MenuItemImpl
      asChild={asChild}
      ref={ref}
      disabled={disabled}
      className={className}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </MenuItemImpl>
  );
});

if (__DEV__) {
  MenuItem.displayName = "MenuItem";
}
