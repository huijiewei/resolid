import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { ariaAttr, dataAttr } from "../../utils/dom";
import { type AsChildProps, Slot } from "../slot/slot";
import { useCollapsibleTrigger } from "./collapsible-context";

export const CollapsibleTrigger = forwardRef<HTMLButtonElement, AsChildProps<"button">>((props, ref) => {
  const { asChild, children, ...rest } = props;

  const { id, opened, disabled, toggle } = useCollapsibleTrigger();
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : "button"}
      disabled={disabled}
      data-disabled={dataAttr(disabled)}
      aria-expanded={ariaAttr(opened)}
      aria-controls={id}
      onClick={() => {
        toggle();
      }}
      {...rest}
    >
      {children}
    </Comp>
  );
});

if (__DEV__) {
  CollapsibleTrigger.displayName = "CollapsibleTrigger";
}
