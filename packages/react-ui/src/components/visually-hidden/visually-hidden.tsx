import { __DEV__ } from "@resolid/utils";
import type { ComponentPropsWithoutRef } from "react";
import { clsx } from "../../utils/classed";

export const VisuallyHidden = (props: ComponentPropsWithoutRef<"span">) => {
  const { children, className, ...rest } = props;

  return (
    <span {...rest} className={clsx("sr-only", className)}>
      {children}
    </span>
  );
};

if (__DEV__) {
  VisuallyHidden.displayName = "VisuallyHidden";
}
