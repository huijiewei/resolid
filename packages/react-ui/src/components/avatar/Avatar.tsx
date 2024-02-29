import { __DEV__ } from "@resolid/utils";
import { forwardRef, type CSSProperties, type HTMLAttributeReferrerPolicy, type ReactElement } from "react";
import { clsx } from "../../utils/classed";
import { toRounded } from "../../utils/radius";
import type { BaseProps } from "../slot/Slot";
import { toColored, toSized } from "./Avatar.style";
import type { AvatarBaseProps } from "./AvatarGroupContext";
import { useAvatarGroup } from "./AvatarGroupContext";
import { AvatarImage } from "./AvatarImage";

export type AvatarProps = AvatarBaseProps & {
  /**
   * The image url of the Avatar
   */
  src?: string;

  /**
   * List of sources to use for different screen resolutions
   */
  srcSet?: string;

  /**
   * Avatar name
   */
  name?: string;

  /**
   * Defines loading strategy
   */
  loading?: "eager" | "lazy";

  /**
   * 未指定 name 和 src 时的回退
   * @default 'DefaultIcon'
   * @type ReactElement
   */
  fallback?: ReactElement;

  /**
   * Defining which referrer is sent when fetching the resource.
   * @type HTMLAttributeReferrerPolicy
   */
  referrerPolicy?: HTMLAttributeReferrerPolicy;

  /**
   * Function called when image failed to load
   */
  onError?: () => void;
};

export const Avatar = forwardRef<HTMLDivElement, BaseProps<"div", AvatarProps>>((props, ref) => {
  const group = useAvatarGroup();

  const {
    className,
    children,
    name,
    src,
    srcSet,
    loading,
    referrerPolicy,
    radius = group?.radius ?? "full",
    size = group?.size ?? "md",
    onError,
    style,
    ...rest
  } = props;

  const rounded = group ? group.rounded : toRounded(radius);
  const sized = group ? group.sized : toSized(size);
  const colored = toColored(name);

  return (
    <div
      ref={ref}
      style={
        {
          ...style,
          "--rounded-var": !group ? rounded.value : undefined,
          "--size-var": !group ? sized.value : undefined,
          "--color-bg-var": colored.value?.split(",")[0],
          "--color-text-var": colored.value?.split(",")[1],
        } as CSSProperties
      }
      className={clsx(
        "relative inline-flex shrink-0 items-center justify-center text-center align-top font-medium uppercase",
        colored.style,
        rounded.style,
        sized.style,
        group && "border-bg-default border-2 [&:not(:first-child)]:mr-[--spacing-var]",
        className,
      )}
      {...rest}
    >
      <AvatarImage
        rounded={rounded.style}
        name={name}
        src={src}
        referrerPolicy={referrerPolicy}
        srcSet={srcSet}
        loading={loading}
        onError={onError}
      />
      {children}
    </div>
  );
});

if (__DEV__) {
  Avatar.displayName = "Avatar";
}
