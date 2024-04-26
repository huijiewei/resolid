import { useEffect, useMemo, useRef } from "react";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const useCallbackRef = <T extends (...args: any[]) => any>(callback: T | undefined): T => {
  const ref = useRef(callback);

  useEffect(() => {
    ref.current = callback;
  });

  return useMemo(() => ((...args) => ref.current?.(...args)) as T, []);
};
