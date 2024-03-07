import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { clsx } from "../../utils/classed";
import type { BaseProps } from "../slot/Slot";
import { VisuallyHidden } from "../visually-hidden/VisuallyHidden";
import { spinnerStyles, type SpinnerStyles } from "./Spinner.styles";

export type SpinnerProps = {
  /**
   * Size
   * @default 'md'
   */
  size?: SpinnerStyles["size"];

  /**
   * Color
   * @default 'primary'
   */
  color?: SpinnerStyles["color"];
  /**
   * Label
   * @default 'Loading…'
   */
  label?: string;
};

export const Spinner = forwardRef<HTMLSpanElement, BaseProps<"span", SpinnerProps>>((props, ref) => {
  const { label = "加载中", className, size = "md", color = "primary", ...rest } = props;

  return (
    <span ref={ref} className={clsx(spinnerStyles({ color, size }), className)} {...rest}>
      {label && <VisuallyHidden>{label}</VisuallyHidden>}
    </span>
  );
});

if (__DEV__) {
  Spinner.displayName = "Spinner";
}
