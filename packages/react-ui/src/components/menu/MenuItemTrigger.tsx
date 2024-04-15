import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { useMergeRefs } from "../../hooks";
import { clsx } from "../../utils/classed";
import { dataAttr } from "../../utils/dom";
import { useFloatingDispatch } from "../floating/floatingDispatchContext";
import { useFloatingReference } from "../floating/floatingReferenceContext";
import type { AsChildProps } from "../slot/Slot";
import { MenuItem, type MenuItemProps } from "./MenuItem";
import { MenuItemTriggerProvider } from "./menuItemTriggerContext";

export type MenuItemTriggerProps = Omit<MenuItemProps, "onClick">;

export const MenuItemTrigger = forwardRef<HTMLButtonElement, AsChildProps<"div", MenuItemTriggerProps, "role">>(
  (props, ref) => {
    const { asChild, children, className, disabled, ...rest } = props;

    const { setReference, getReferenceProps, opened } = useFloatingReference();
    const { close } = useFloatingDispatch();

    const refs = useMergeRefs(ref, setReference);

    return (
      <MenuItemTriggerProvider value={true}>
        <MenuItem
          ref={refs}
          asChild={asChild}
          data-opened={dataAttr(opened)}
          className={clsx("justify-between pe-0.5 opened:[&:not([data-active])]:bg-bg-subtlest", className)}
          {...getReferenceProps({
            ...rest,
            onKeyDown: (event) => {
              if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                close();
              }
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
        </MenuItem>
      </MenuItemTriggerProvider>
    );
  },
);

if (__DEV__) {
  MenuItemTrigger.displayName = "MenuItemTrigger";
}
