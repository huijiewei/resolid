import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { useMergeRefs } from "../../hooks";
import { AngleRight } from "../../shared/Icons";
import { clsx } from "../../utils/classed";
import { dataAttr } from "../../utils/dom";
import { useFloatingReference } from "../floating/floatingReferenceContext";
import type { AsChildProps } from "../slot/Slot";
import { MenuItemInner, type MenuItemProps } from "./MenuItem";

export type MenuItemTriggerProps = Omit<MenuItemProps, "onClick">;

export const MenuItemTrigger = forwardRef<HTMLButtonElement, AsChildProps<"div", MenuItemTriggerProps, "role">>(
  (props, ref) => {
    const { asChild, children, className, disabled, ...rest } = props;

    const { setReference, getReferenceProps, opened } = useFloatingReference();

    const refs = useMergeRefs(ref, setReference);

    return (
      <MenuItemInner
        ref={refs}
        asChild={asChild}
        data-opened={dataAttr(opened)}
        className={clsx("justify-between pe-0.5 opened:[&:not([data-active])]:bg-bg-subtlest", className)}
        {...getReferenceProps(rest)}
      >
        {children}
        <span className={clsx("ms-5", disabled ? "text-fg-subtle" : "text-fg-muted")}>
          <AngleRight />
        </span>
      </MenuItemInner>
    );
  },
);

if (__DEV__) {
  MenuItemTrigger.displayName = "MenuItemTrigger";
}
