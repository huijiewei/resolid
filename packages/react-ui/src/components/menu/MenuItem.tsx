import { useListItem } from "@floating-ui/react";
import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { useMergeRefs } from "../../hooks";
import { clsx } from "../../utils/classed";
import { Slot, type AsChildProps } from "../slot/Slot";
import { useMenuSelect } from "./MenuContext";

export type MenuItemProps = {
  onClick?: () => void;
};

export const menuItemStyles =
  "flex w-full items-center select-none rounded outline-none transition-colors px-2 py-1.5 focus:bg-bg-subtle disabled:text-fg-muted disabled:pointer-events-none";

export const MenuItem = forwardRef<HTMLButtonElement, AsChildProps<"button", MenuItemProps, "type" | "tabIndex">>(
  (props, ref) => {
    const { asChild, className, role, children, onClick, disabled = false, ...rest } = props;

    const { tree, getItemProps, activeIndex } = useMenuSelect();
    const { ref: itemRef, index } = useListItem();

    const refs = useMergeRefs(ref, itemRef);

    const isActive = index === activeIndex && index !== null;

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={refs}
        role={role ?? "menuitem"}
        type={Comp == "button" ? "button" : undefined}
        disabled={disabled}
        className={clsx(menuItemStyles, "cursor-default", className)}
        tabIndex={isActive ? 0 : -1}
        {...getItemProps({
          onClick: () => {
            tree?.events.emit("click");
            onClick && onClick();
          },
        })}
        {...rest}
      >
        {children}
      </Comp>
    );
  },
);

if (__DEV__) {
  MenuItem.displayName = "MenuItem";
}
