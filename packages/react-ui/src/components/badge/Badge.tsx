import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { clsx } from "../../utils/classed";
import { Slot, type AsChildProps } from "../slot/Slot";
import { badgeStyles, type BadgeStyleProps } from "./badge.styles";

export type BadgeProps = {
  /**
   * 颜色
   * @default 'primary'
   */
  color?: BadgeStyleProps["color"];

  /**
   * 外观
   * @default 'solid'
   */
  variant?: BadgeStyleProps["variant"];
};

export const Badge = forwardRef<HTMLSpanElement, AsChildProps<"span", BadgeProps>>((props, ref) => {
  const { asChild, color = "primary", variant = "solid", className, children, ...rest } = props;

  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      className={clsx(
        "inline-flex items-center rounded border px-2 py-1 text-xs font-medium",
        badgeStyles({ color, variant }),
        className,
      )}
      ref={ref}
      {...rest}
    >
      {children}
    </Comp>
  );
});

if (__DEV__) {
  Badge.displayName = "Badge";
}
