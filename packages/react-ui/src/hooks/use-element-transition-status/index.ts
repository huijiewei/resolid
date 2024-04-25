import { useTransitionStatus, type UseTransitionStatusProps } from "@floating-ui/react";
import { useCallback, useRef, useState } from "react";

export const useElementTransitionStatus = <E extends HTMLElement = HTMLElement>(
  opened: boolean,
  props: UseTransitionStatusProps = {},
) => {
  const elementRef = useRef<E | null>(null);
  const [elementState, setElementState] = useState<E | null>(null);

  const setElement = useCallback((node: E | null) => {
    if (node !== elementRef.current) {
      elementRef.current = node;
      setElementState(node);
    }
  }, []);

  const { isMounted, status } = useTransitionStatus(
    // @ts-expect-error Argument of type
    {
      open: opened,
      elements: { floating: elementState, reference: null, domReference: null },
    },
    props,
  );

  return { isMounted, status, setElement };
};
