import { useEffect } from "react";
import { useCallbackRef } from "../use-callback-ref";

export const useTimeout = (callback: () => void, delay: number | null) => {
  const fn = useCallbackRef(callback);

  useEffect(() => {
    if (delay == null) {
      return;
    }

    const id = setTimeout(() => fn(), delay);

    return () => id && clearTimeout(id);
  }, [delay, fn]);
};
