import { __DEV__, omit } from "@resolid/utils";
import { forwardRef, isValidElement, type ReactElement } from "react";
import type { BaseProps } from "../slot/Slot";
import { shouldShowFallback, useImage, type FallbackStrategy, type UseImageProps } from "./useImage";

export type ImageProps = UseImageProps & {
  /**
   * Fallback element or string to show if image is loading or image fails.
   */
  fallback?: string | ReactElement;

  /**
   * - beforeOrError(default): loads the fallback while loading the src
   * - onError: loads the fallback only if there is an error fetching the src
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

    return <img alt={alt} src={fallback as string} {...omit(rest, ["onLoad", "onError"])} />;
  }

  return (
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
