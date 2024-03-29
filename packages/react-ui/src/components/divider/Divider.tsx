import { __DEV__ } from "@resolid/utils";
import { forwardRef, type CSSProperties } from "react";
import { clsx } from "../../utils/classed";
import type { BaseProps } from "../slot/Slot";
import { dividerStyles, type DividerStyleProps } from "./Divider.styles";

export type DividerProps = {
  /**
   * 颜色
   * @default "neutral"
   */
  color?: DividerStyleProps["color"];

  /**
   * 外观
   * @default "solid"
   */
  variant?: DividerStyleProps["variant"];

  /**
   * 大小
   * @default 1
   */
  size?: number;

  /**
   * 垂直分割线
   * @default false
   */
  vertical?: boolean;

  /**
   * 分割线文字位置
   * @default "center"
   */
  position?: "left" | "right" | "center";
};

export const Divider = forwardRef<HTMLDivElement, BaseProps<"div", DividerProps, "role">>((props, ref) => {
  const {
    color = "neutral",
    vertical = false,
    size = 1,
    variant = "solid",
    position = "center",
    className,
    children,
    ...rest
  } = props;

  const hasLabel = !!children && !vertical;

  return (
    <div
      role={"separator"}
      aria-orientation={vertical ? "vertical" : "horizontal"}
      ref={ref}
      style={
        {
          "--size-var": `${size}px`,
        } as CSSProperties
      }
      className={clsx(dividerStyles({ color, variant, vertical, label: hasLabel, position }), className)}
      {...rest}
    >
      {hasLabel && children}
    </div>
  );
});

if (__DEV__) {
  Divider.displayName = "Divider";
}
