import { __DEV__ } from "@resolid/utils";
import { type CSSProperties, Children, type ReactElement, isValidElement } from "react";
import { clsx } from "../../utils/classed";
import { toRounded } from "../../utils/radius";
import type { BaseProps } from "../slot/slot";
import { type AvatarBaseProps, AvatarGroupProvider } from "./avatar-group-context";
import { toSized } from "./avatar.styles";

export type AvatarGroupProps = AvatarBaseProps & {
  /**
   * 可见头像数量限制
   * @default 3
   */
  limit?: number | null;

  /**
   * 组中头像之间的空间
   * @default '-0.75em'
   */
  spacing?: string;
};

export const AvatarGroup = (props: BaseProps<"div", AvatarGroupProps>) => {
  const { className, children, style, size = "md", radius = "full", limit = 3, spacing = "-0.75em", ...rest } = props;

  const validChildren = Children.toArray(children).filter((child) => isValidElement(child)) as ReactElement[];

  const economy = limit ? validChildren.slice(0, limit) : validChildren;
  const excess = limit != null ? validChildren.length - limit : 0;

  const sized = toSized(size);
  const rounded = toRounded(radius);

  return (
    <div
      role={"group"}
      style={
        {
          ...style,
          "--spacing-var": spacing,
          "--rounded-var": rounded.value,
          "--size-var": sized.value,
        } as CSSProperties
      }
      className={clsx("flex flex-row-reverse items-center justify-end", className)}
      {...rest}
    >
      {excess > 0 && (
        <span
          className={clsx(
            "bg-bg-subtle text-fg-normal relative inline-flex shrink-0 items-center justify-center text-center font-medium uppercase",
            sized.style,
            rounded.style,
          )}
        >{`+${excess}`}</span>
      )}
      <AvatarGroupProvider value={{ sized, rounded }}>{economy.reverse()}</AvatarGroupProvider>
    </div>
  );
};

if (__DEV__) {
  AvatarGroup.displayName = "AvatarGroup";
}
