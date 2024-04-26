import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { clsx } from "../../utils/classed";
import type { BaseProps } from "../slot/slot";
import { VisuallyHidden } from "../visually-hidden/visually-hidden";
import { type SpinnerStyles, spinnerStyles } from "./spinner.styles";

export type SpinnerProps = {
  /**
   * 大小
   * @default 'md'
   */
  size?: SpinnerStyles["size"];

  /**
   * 颜色
   * @default 'primary'
   */
  color?: SpinnerStyles["color"];
  /**
   * 标签
   * @default '加载中'
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
