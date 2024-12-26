import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { useMergeRefs } from "../../hooks";
import { AngleRight } from "../../shared/icons";
import { clsx } from "../../utils/classed";
import { dataAttr } from "../../utils/dom";
import { useFloatingReference } from "../floating/floating-reference-context";
import type { AsChildProps } from "../slot/slot";
import { MenuItemImpl, type MenuItemImplProps } from "./menu-item-impl";

export type MenuItemTriggerProps = MenuItemImplProps;

export const MenuItemTrigger = forwardRef<HTMLDivElement, AsChildProps<"div", MenuItemTriggerProps, "role">>(
  (props, ref) => {
    const { asChild, children, className, disabled, ...rest } = props;

    const { setReference, getReferenceProps, opened } = useFloatingReference();

    const refs = useMergeRefs(ref, setReference);

    return (
      <MenuItemImpl
        ref={refs}
        asChild={asChild}
        data-opened={dataAttr(opened)}
        className={clsx("opened:[&:not([data-active])]:bg-bg-subtlest justify-between pe-0.5", className)}
        {...getReferenceProps(rest)}
      >
        {children}
        <span className={clsx("ms-5", disabled ? "text-fg-subtle" : "text-fg-muted")}>
          <AngleRight />
        </span>
      </MenuItemImpl>
    );
  },
);

if (__DEV__) {
  MenuItemTrigger.displayName = "MenuItemTrigger";
}
