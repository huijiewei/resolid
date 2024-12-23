import { type ImgHTMLAttributes, type SyntheticEvent, useCallback, useEffect, useRef, useState } from "react";
import { useIsomorphicEffect } from "../../hooks";

type NativeImageProps = ImgHTMLAttributes<HTMLImageElement>;

export type UseImageProps = {
  /**
   * 图片的 URL
   */
  src?: string;

  /**
   * 以逗号分隔的一个或多个字符串列表表明一系列用户代理使用的可能的图片
   * @link https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img#srcset
   */
  srcSet?: string;

  /**
   * 表示资源大小的、以逗号隔开的一个或多个字符串
   * @link https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img#sizes
   */
  sizes?: string;

  /**
   * 指示浏览器应当如何加载该图片
   * @link https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img#loading
   */
  loading?: NativeImageProps["loading"];

  /**
   * 表明是否必须使用 CORS 完成相关图片的抓取
   * @link https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img#crossorigin
   */
  crossOrigin?: NativeImageProps["crossOrigin"];

  /**
   * 图片加载成功回调
   */
  onLoad?: (event: ImageEvent) => void;

  /**
   * 图片加载失败回调
   */
  onError?: (event: ImageEvent) => void;
};

type Status = "loading" | "failed" | "pending" | "loaded";
type ImageEvent = SyntheticEvent<HTMLImageElement, Event>;

export const useImage = (props: UseImageProps) => {
  const { loading, crossOrigin, src, srcSet, onLoad, onError, sizes } = props;

  const [status, setStatus] = useState<Status>("pending");

  useEffect(() => {
    setStatus(src ? "loading" : "pending");
  }, [src]);

  const imageRef = useRef<HTMLImageElement | null>(null);

  const flush = useCallback(() => {
    if (imageRef.current) {
      imageRef.current.onload = null;
      imageRef.current.onerror = null;
      imageRef.current = null;
    }
  }, []);

  const load = useCallback(() => {
    if (!src) {
      return;
    }

    flush();

    const img = new Image();
    img.src = src;

    if (crossOrigin) {
      img.crossOrigin = crossOrigin;
    }

    if (srcSet) {
      img.srcset = srcSet;
    }

    if (sizes) {
      img.sizes = sizes;
    }

    if (loading) {
      img.loading = loading;
    }

    img.onload = (event) => {
      flush();
      setStatus("loaded");
      onLoad?.(event as unknown as ImageEvent);
    };

    img.onerror = (error) => {
      flush();
      setStatus("failed");
      onError?.(error as unknown as ImageEvent);
    };

    imageRef.current = img;
  }, [src, flush, crossOrigin, srcSet, sizes, loading, onLoad, onError]);

  useIsomorphicEffect(() => {
    if (status === "loading") {
      load();
    }

    return () => {
      flush();
    };
  }, [load, status, flush]);

  return status;
};

export type FallbackStrategy = "onError" | "beforeOrError";

export const shouldShowFallback = (status: Status, fallbackStrategy: FallbackStrategy) =>
  (status !== "loaded" && fallbackStrategy === "beforeOrError") ||
  (status === "failed" && fallbackStrategy === "onError");
