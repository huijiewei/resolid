import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { FloatingArrow, type FloatingArrowProps } from "../floating/floating-arrow";
import { FloatingTrigger, type FloatingTriggerProps } from "../floating/floating-trigger";
import { PopoverBody } from "./popover-body";
import { PopoverCloseButton } from "./popover-close-button";
import { PopoverContent } from "./popover-content";
import { PopoverFooter } from "./popover-footer";
import { PopoverHeader } from "./popover-header";
import { PopoverRoot, type PopoverRootProps } from "./popover-root";

export type { PopoverRootProps };

export const Popover = PopoverRoot;

export const PopoverTrigger = forwardRef<HTMLButtonElement, Omit<FloatingTriggerProps, "active">>((props, ref) => (
  <FloatingTrigger ref={ref} active={true} {...props} />
));

if (__DEV__) {
  PopoverTrigger.displayName = "PopoverTrigger";
}

export const PopoverArrow = (props: FloatingArrowProps) => {
  const { width = 11, height = 6, ...rest } = props;

  return <FloatingArrow width={width} height={height} {...rest} />;
};

export { PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader };
