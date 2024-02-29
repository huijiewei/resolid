import { useCallback, useEffect, useRef, useState, type ImgHTMLAttributes, type SyntheticEvent } from 'react';
import { useIsomorphicEffect } from '../../hooks';

type NativeImageProps = ImgHTMLAttributes<HTMLImageElement>;

export type UseImageProps = {
  /**
   * The image URL
   */
  src?: string;

  /**
   * One or more strings separated by commas, indicating possible image sources for the user agent to use
   * @link https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img#attr-srcset
   */
  srcSet?: string;

  /**
   * One or more strings separated by commas, indicating a set of source sizes
   * @link https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img#attr-sizes
   */
  sizes?: string;

  /**
   * Indicates how the browser should load the image
   * @link https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img#attr-loading
   */
  loading?: NativeImageProps['loading'];

  /**
   * Indicates if the fetching of the image must be done using a CORS request
   * @link https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img#attr-crossorigin
   */
  crossOrigin?: NativeImageProps['crossOrigin'];

  /**
   * A callback for when the image `src` has been loaded
   */
  onLoad?: (event: ImageEvent) => void;

  /**
   * A callback for when there was an error loading the image `src`
   */
  onError?: (event: ImageEvent) => void;
};

type Status = 'loading' | 'failed' | 'pending' | 'loaded';
type ImageEvent = SyntheticEvent<HTMLImageElement, Event>;

export const useImage = (props: UseImageProps) => {
  const { loading, crossOrigin, src, srcSet, onLoad, onError, sizes } = props;

  const [status, setStatus] = useState<Status>('pending');

  useEffect(() => {
    setStatus(src ? 'loading' : 'pending');
  }, [src]);

  const imageRef = useRef<HTMLImageElement | null>();

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
      setStatus('loaded');
      onLoad?.(event as unknown as ImageEvent);
    };

    img.onerror = (error) => {
      flush();
      setStatus('failed');
      onError?.(error as unknown as ImageEvent);
    };

    imageRef.current = img;
  }, [src, crossOrigin, srcSet, sizes, onLoad, onError, loading]);

  const flush = () => {
    if (imageRef.current) {
      imageRef.current.onload = null;
      imageRef.current.onerror = null;
      imageRef.current = null;
    }
  };

  useIsomorphicEffect(() => {
    if (status === 'loading') {
      load();
    }

    return () => {
      flush();
    };
  }, [load, status]);

  return status;
};

export type FallbackStrategy = 'onError' | 'beforeOrError';

export const shouldShowFallback = (status: Status, fallbackStrategy: FallbackStrategy) =>
  (status !== 'loaded' && fallbackStrategy === 'beforeOrError') ||
  (status === 'failed' && fallbackStrategy === 'onError');
