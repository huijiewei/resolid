import { isFunction } from "@resolid/utils";
import type { Ref, RefCallback, RefObject } from "react";
import { useCallback } from "react";

type PossibleRef<T> = Ref<T> | undefined;

export const assignRef = <T>(ref: PossibleRef<T>, value: T) => {
  if (isFunction(ref)) {
    ref(value);
  } else if (ref != null) {
    (ref as RefObject<T>).current = value;
  }
};

export const mergeRefs = <T>(...refs: PossibleRef<T>[]) => {
  return (node: T) => {
    for (const ref of refs) {
      assignRef(ref, node);
    }
  };
};

export const useMergeRefs = <T>(...refs: PossibleRef<T>[]) => {
  // eslint-disable-next-line react-compiler/react-compiler
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(mergeRefs(...refs), refs) as RefCallback<T>;
};
