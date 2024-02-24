import { isBrowser } from "@resolid/utils";
import { useMemo, useSyncExternalStore } from "react";

export const useMediaQuery = (query: string) => {
  const [getSnapshot, subscribe] = useMemo(() => {
    const mediaQueryList = isBrowser() ? window.matchMedia(query) : null;

    return [
      () => mediaQueryList?.matches ?? false,

      (callback: () => void) => {
        if (!mediaQueryList) {
          return () => void 0;
        }

        mediaQueryList.addEventListener("change", callback);
        return () => {
          mediaQueryList.removeEventListener("change", callback);
        };
      },
    ];
  }, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
};
