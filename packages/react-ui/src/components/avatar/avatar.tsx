import { __DEV__ } from "@resolid/utils";
import { forwardRef, type CSSProperties, type HTMLAttributeReferrerPolicy, type ReactElement } from "react";
import { clsx } from "../../utils/classed";
import { toRounded } from "../../utils/radius";
import type { BaseProps } from "../slot/slot";
import type { AvatarBaseProps } from "./avatar-group-context";
import { useAvatarGroup } from "./avatar-group-context";
import { AvatarImage } from "./avatar-image";
import { toColored, toSized } from "./avatar.styles";

export type AvatarProps = AvatarBaseProps & {
  /**
   * 头像图片的 URL
   */
  src?: string;

  /**
   * 以逗号分隔的一个或多个字符串列表表明一系列用户代理使用的可能的图片
   * @link https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img#srcset
   */
  srcSet?: string;

  /**
   * 头像的名称
   */
  name?: string;

  /**
   * 指示浏览器应当如何加载该头像图片
   * @link https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img#loading
   */
  loading?: "eager" | "lazy";

  /**
   * 未指定 name 和 src 时的回退
   * @default 'DefaultIcon'
   */
  fallback?: ReactElement;

  /**
   * 一个字符串，指示在获取头像图片时使用的来源地址
   */
  referrerPolicy?: HTMLAttributeReferrerPolicy;

  /**
   * 头像图片加载失败回调
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
    radius = "full",
    size = "md",
    style,
    onError,
    ...rest
  } = props;

  const sized = group?.sized ?? toSized(size);
  const rounded = group?.rounded ?? toRounded(radius);
  const colored = toColored(name);

  return (
    <div
      ref={ref}
      style={
        {
          ...style,
          "--rounded-var": !group && rounded?.value,
          "--size-var": !group && sized?.value,
          "--color-bg-var": colored.value?.split(",")[0],
          "--color-text-var": colored.value?.split(",")[1],
        } as CSSProperties
      }
      className={clsx(
        "relative inline-flex shrink-0 items-center justify-center text-center align-top font-medium uppercase",
        colored.style,
        sized?.style,
        rounded?.style,
        group && "border-2 border-bg-normal [&:not(:first-child)]:mr-[--spacing-var]",
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
