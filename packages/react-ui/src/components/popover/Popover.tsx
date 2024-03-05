import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { FloatingArrow, type FloatingArrowProps } from "../floating/FloatingArrow";
import { FloatingTrigger, type FloatingTriggerProps } from "../floating/FloatingTrigger";
import { PopoverBody } from "./PopoverBody";
import { PopoverCloseButton } from "./PopoverCloseButton";
import { PopoverContent } from "./PopoverContent";
import { PopoverFooter } from "./PopoverFooter";
import { PopoverHeader } from "./PopoverHeader";
import { PopoverRoot, type PopoverProps } from "./PopoverRoot";

export type { PopoverProps };

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
