import { isBrowser, runIfFunction, type MaybeFunction } from "@resolid/utils";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useEventListener } from "../use-event-listener";

export const useLocalStorage = <T>(key: string, initialValue: MaybeFunction<T>): [T, Dispatch<SetStateAction<T>>] => {
  const readValue = () => {
    if (!isBrowser()) {
      return runIfFunction(initialValue);
    }

    const item = window.localStorage.getItem(key);

    if (item != null) {
      return JSON.parse(item);
    }

    return runIfFunction(initialValue);
  };

  const [state, setState] = useState<T>(readValue);

  const setValue: Dispatch<SetStateAction<T>> = (value) => {
    const newValue = runIfFunction(value, state);

    setState(newValue);

    if (!isBrowser()) {
      return;
    }

    if (newValue != undefined) {
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } else {
      window.localStorage.removeItem(key);
    }
  };

  useEventListener("storage", (event: StorageEvent) => {
    if (event.key !== key || event.storageArea !== window.localStorage) {
      return;
    }

    setState(event.newValue ? JSON.parse(event.newValue) : undefined);
  });

  return [state, setValue];
};
