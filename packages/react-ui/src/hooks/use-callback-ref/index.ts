import type { AnyFunction } from "@resolid/utils";
import { useEffect, useMemo, useRef } from "react";

export const useCallbackRef = <A = unknown, R = unknown>(
  callback: AnyFunction<A, R> | undefined,
): AnyFunction<A, R> => {
  const ref = useRef(callback);

  useEffect(() => {
    ref.current = callback;
  });

  return useMemo(() => ((...args) => ref.current?.(...args)) as AnyFunction<A, R>, []);
};
