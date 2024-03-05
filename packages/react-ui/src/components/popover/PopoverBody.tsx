import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { clsx } from "../../utils/classed";
import { useFloatingAria } from "../floating/FloatingAriaContext";
import type { BaseProps, EmptyProps } from "../slot/Slot";

export const PopoverBody = forwardRef<HTMLDivElement, BaseProps<"div", EmptyProps, "id">>((props, ref) => {
  const { children, className, ...rest } = props;

  const { descriptionId } = useFloatingAria();

  return (
    <div id={descriptionId} ref={ref} className={clsx("p-4", className)} {...rest}>
      {children}
    </div>
  );
});

if (__DEV__) {
  PopoverBody.displayName = "PopoverBody";
}
