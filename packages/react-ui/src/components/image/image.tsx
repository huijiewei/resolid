import { __DEV__, omit } from "@resolid/utils";
import { type ReactElement, forwardRef, isValidElement } from "react";
import type { BaseProps } from "../slot/slot";
import { type FallbackStrategy, type UseImageProps, shouldShowFallback, useImage } from "./use-image";

export type ImageProps = UseImageProps & {
  /**
   * 图片加载的后备显示, 可以是 URL 或者 ReactElement
   */
  fallback?: string | ReactElement;

  /**
   * - beforeOrError(默认): 图片加载前或者加载错误都进行后备显示
   * - onError: 图片加载失败才进行后备显示
   *
   * @default "beforeOrError"
   */
  fallbackStrategy?: FallbackStrategy;
};

export const Image = forwardRef<HTMLImageElement, BaseProps<"img", ImageProps>>((props, ref) => {
  const {
    src,
    srcSet,
    sizes,
    alt,
    fallback,
    fallbackStrategy = "beforeOrError",
    loading = "lazy",
    decoding = "async",
    crossOrigin,
    referrerPolicy,
    ...rest
  } = props;

  const status = useImage(props);

  const showFallback = shouldShowFallback(status, fallbackStrategy);

  if (showFallback) {
    if (isValidElement(fallback)) {
      return fallback;
    }

    // biome-ignore lint/a11y/useAltText: <explanation>
    return <img alt={alt} src={fallback as string} {...omit(rest, ["onLoad", "onError"])} />;
  }

  return (
    // biome-ignore lint/a11y/useAltText: <explanation>
    <img
      alt={alt}
      sizes={sizes}
      crossOrigin={crossOrigin}
      referrerPolicy={referrerPolicy}
      loading={loading}
      decoding={decoding}
      ref={ref}
      src={src}
      srcSet={srcSet}
      {...rest}
    />
  );
});

if (__DEV__) {
  Image.displayName = "Image";
}
