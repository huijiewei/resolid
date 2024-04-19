import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { FloatingArrow } from "../floating/floating-arrow";
import { FloatingTrigger, type FloatingTriggerProps } from "../floating/floating-trigger";
import { TooltipContent } from "./tooltip-content";
import { TooltipRoot, type TooltipRootProps } from "./tooltip-root";

export type { TooltipRootProps };

export const Tooltip = TooltipRoot;

export const TooltipTrigger = forwardRef<HTMLButtonElement, Omit<FloatingTriggerProps, "active">>((props, ref) => (
  <FloatingTrigger ref={ref} active={false} {...props} />
));

if (__DEV__) {
  TooltipTrigger.displayName = "TooltipTrigger";
}

export const TooltipArrow = FloatingArrow;

export { TooltipContent };
