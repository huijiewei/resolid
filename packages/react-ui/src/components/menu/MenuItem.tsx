import { useListItem } from "@floating-ui/react";
import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { useMergeRefs } from "../../hooks";
import { clsx } from "../../utils/classed";
import { ariaAttr, dataAttr } from "../../utils/dom";
import { Slot, type AsChildProps } from "../slot/Slot";
import { useMenuSelect } from "./menuContext";
import { useMenuItemTrigger } from "./menuItemTriggerContext";

export type MenuItemProps = {
  disabled?: boolean;
  onClick?: () => void;
};

export const MenuItem = forwardRef<HTMLButtonElement, AsChildProps<"div", MenuItemProps, "tabIndex">>((props, ref) => {
  const { asChild, className, role, children, onClick, disabled = false, ...rest } = props;

  const { tree, getItemProps, activeIndex } = useMenuSelect();
  const { ref: itemRef, index } = useListItem();
  const menuItemTrigger = useMenuItemTrigger();

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
      {...getItemProps({
        ...rest,
        onClick:
          disabled || menuItemTrigger
            ? undefined
            : () => {
                tree?.events.emit("click");
                onClick && onClick();
              },
      })}
    >
      {children}
    </Comp>
  );
});

if (__DEV__) {
  MenuItem.displayName = "MenuItem";
}
