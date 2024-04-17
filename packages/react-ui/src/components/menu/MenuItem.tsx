import { useListItem } from "@floating-ui/react";
import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { useMergeRefs } from "../../hooks";
import { clsx } from "../../utils/classed";
import { ariaAttr, dataAttr } from "../../utils/dom";
import { Slot, type AsChildProps } from "../slot/Slot";
import { useMenuSelect } from "./menuContext";

export type MenuItemProps = {
  disabled?: boolean;
  onClick?: () => void;
};

export const MenuItemInner = forwardRef<HTMLButtonElement, AsChildProps<"div", MenuItemProps, "tabIndex">>(
  (props, ref) => {
    const { asChild, className, role, children, onClick, disabled = false, ...rest } = props;

    const { getItemProps, activeIndex } = useMenuSelect();
    const { ref: itemRef, index } = useListItem();

    const refs = useMergeRefs(ref, itemRef);

    const isActive = index === activeIndex && index !== null;

    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={refs}
        role={role ?? "menuitem"}
        aria-disabled={ariaAttr(disabled)}
        data-active={dataAttr(isActive)}
        className={clsx(
          "flex w-full select-none items-center rounded px-2 py-1.5 outline-none transition-colors",
          disabled ? "text-fg-muted" : "active:bg-bg-subtle",
          className,
        )}
        tabIndex={isActive ? 0 : -1}
        {...getItemProps({ ...rest, onClick })}
      >
        {children}
      </Comp>
    );
  },
);

if (__DEV__) {
  MenuItemInner.displayName = "MenuItemInner";
}

export const MenuItem = forwardRef<HTMLButtonElement, AsChildProps<"div", MenuItemProps, "tabIndex">>((props, ref) => {
  const { asChild, className, disabled = false, children, onClick, ...rest } = props;

  const { tree } = useMenuSelect();

  const handleClick = () => {
    onClick && onClick();
    tree?.events.emit("click");
  };

  return (
    <MenuItemInner
      asChild={asChild}
      ref={ref}
      disabled={disabled}
      className={className}
      onClick={disabled ? undefined : handleClick}
      onKeyDown={
        disabled
          ? undefined
          : (event) => {
              if (event.key == " " || event.key == "Enter") {
                event.preventDefault();
                event.stopPropagation();
                handleClick();
              }
            }
      }
      {...rest}
    >
      {children}
    </MenuItemInner>
  );
});

if (__DEV__) {
  MenuItem.displayName = "MenuItem";
}
