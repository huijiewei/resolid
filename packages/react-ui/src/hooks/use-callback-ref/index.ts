import type { AnyFunction } from "@resolid/utils";
import { useEffect, useMemo, useRef } from "react";

export const useCallbackRef = <R, A>(callback: AnyFunction<R, A> | undefined): AnyFunction<R, A> => {
  const ref = useRef(callback);

  useEffect(() => {
    ref.current = callback;
  });

  return useMemo(() => ((...args) => ref.current?.(...args)) as AnyFunction<R, A>, []);
};
