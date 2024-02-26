import { runIfFunction, type MaybeFunction } from "@resolid/utils";
import { useCallback, useState, type Dispatch, type SetStateAction } from "react";
import { useCallbackRef } from "../use-callback-ref";

export type UseControllableStateProps<T> = {
  value?: T;
  defaultValue?: MaybeFunction<T>;
  onChange?: (value: T) => void;
  shouldUpdate?: (prev: T, next: T) => boolean;
};

export const useControllableState = <T>(props: UseControllableStateProps<T>) => {
  const { value, defaultValue, onChange, shouldUpdate = (prev, next) => prev !== next } = props;

  const onChangeRef = useCallbackRef(onChange);
  const shouldUpdateRef = useCallbackRef(shouldUpdate);

  const [valueState, setValueState] = useState(defaultValue as T);

  const controlled = value !== undefined;
  const state = controlled ? (value as T) : valueState;

  const setState = useCallback(
    (next: SetStateAction<T>) => {
      const nextValue = runIfFunction(next, state);

      if (!shouldUpdateRef(state, nextValue)) {
        return;
      }

      if (!controlled) {
        setValueState(nextValue);
      }

      onChangeRef(nextValue);
    },
    [controlled, onChangeRef, shouldUpdateRef, state],
  );

  return [state, setState] as [T, Dispatch<SetStateAction<T | undefined>>];
};
