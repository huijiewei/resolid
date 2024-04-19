import { FloatingArrow as FloatingUiArrow, type FloatingArrowProps as FloatingArrowUiProps } from "@floating-ui/react";
import { __DEV__ } from "@resolid/utils";
import { clsx } from "../../utils/classed";
import { useFloatingArrow } from "./floating-arrow-context";

export type FloatingArrowProps = Omit<FloatingArrowUiProps, "context" | "stroke" | "fill">;

export const FloatingArrow = (props: FloatingArrowProps) => {
  const { className, width = 8, height = 4, tipRadius = 0.1, strokeWidth = 1, ...rest } = props;

  const arrow = useFloatingArrow();

  return (
    <FloatingUiArrow
      ref={arrow.setArrow}
      className={clsx(arrow.className, className)}
      strokeWidth={strokeWidth}
      width={width}
      height={height}
      context={arrow.context}
      tipRadius={tipRadius}
      {...rest}
    />
  );
};

if (__DEV__) {
  FloatingArrow.displayName = "FloatingArrow";
}
