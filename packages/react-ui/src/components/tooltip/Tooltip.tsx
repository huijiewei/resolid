import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { FloatingArrow } from "../floating/FloatingArrow";
import { FloatingTrigger, type FloatingTriggerProps } from "../floating/FloatingTrigger";
import { TooltipContent } from "./TooltipContent";
import { TooltipRoot, type TooltipProps } from "./TooltipRoot";

export type { TooltipProps };

export const Tooltip = TooltipRoot;

export const TooltipTrigger = forwardRef<HTMLButtonElement, Omit<FloatingTriggerProps, "active">>((props, ref) => (
  <FloatingTrigger ref={ref} active={false} {...props} />
));

if (__DEV__) {
  TooltipTrigger.displayName = "TooltipTrigger";
}

export const TooltipArrow = FloatingArrow;

export { TooltipContent };
