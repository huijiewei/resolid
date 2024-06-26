import { useListItem } from "@floating-ui/react";
import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { useMergeRefs } from "../../hooks";
import { clsx } from "../../utils/classed";
import { ariaAttr, dataAttr } from "../../utils/dom";
import { type AsChildProps, Slot } from "../slot/slot";
import { useMenuSelect } from "./menu-context";

export type MenuItemImplProps = {
  disabled?: boolean;
};

export const MenuItemImpl = forwardRef<HTMLDivElement, AsChildProps<"div", MenuItemImplProps, "tabIndex">>(
  (props, ref) => {
    const { asChild, className, role, children, disabled = false, ...rest } = props;

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
        {...getItemProps(rest)}
      >
        {children}
      </Comp>
    );
  },
);

if (__DEV__) {
  MenuItemImpl.displayName = "MenuItemImpl";
}
