import { useListItem } from "@floating-ui/react";
import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { useMergeRefs } from "../../hooks";
import { clsx } from "../../utils/classed";
import { dataAttr } from "../../utils/dom";
import { useFloatingDispatch } from "../floating/FloatingDispatchContext";
import { useFloatingReference } from "../floating/FloatingReferenceContext";
import { Slot, type AsChildProps, type EmptyProps } from "../slot/Slot";
import { useMenuSelect } from "./MenuContext";
import { menuItemStyles } from "./MenuItem";

export const MenuItemTrigger = forwardRef<HTMLButtonElement, AsChildProps<"button", EmptyProps, "type" | "role">>(
  (props, ref) => {
    const { asChild, children, className, disabled, ...rest } = props;

    const { setReference, getReferenceProps, opened } = useFloatingReference();
    const { close } = useFloatingDispatch();

    const { getItemProps, activeIndex } = useMenuSelect();
    const { ref: itemRef, index } = useListItem();

    const isActive = index === activeIndex && index !== null;

    const refs = useMergeRefs(ref, itemRef, setReference);

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={refs}
        role={"menuitem"}
        type={Comp == "button" ? "button" : undefined}
        tabIndex={isActive ? 0 : -1}
        disabled={disabled}
        data-opened={dataAttr(opened)}
        className={clsx(
          menuItemStyles,
          "cursor-default justify-between pe-0.5",
          "opened:[&:not(:focus)]:bg-bg-subtlest",
          className,
        )}
        {...getReferenceProps({
          ...rest,
          onKeyDown: (event) => {
            if (event.key === "ArrowUp" || event.key === "ArrowDown") {
              close();
            }
          },
        })}
        {...getItemProps({
          onClick: (event) => {
            event.stopPropagation();
          },
        })}
      >
        {children}
        <span className={clsx("ms-5", disabled ? "text-fg-subtle" : "text-fg-muted")}>
          <svg
            className={"h-4 w-4"}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </span>
      </Comp>
    );
  },
);

if (__DEV__) {
  MenuItemTrigger.displayName = "MenuItemTrigger";
}
