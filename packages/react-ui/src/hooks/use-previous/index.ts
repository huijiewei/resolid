import { useEffect, useRef } from "react";

export const usePrevious = <T>(value: T) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  // eslint-disable-next-line react-compiler/react-compiler
  return ref.current;
};
