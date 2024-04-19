import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { useMergeRefs } from "../../hooks";
import { clsx } from "../../utils/classed";
import { dataAttr } from "../../utils/dom";
import type { BaseProps, EmptyProps } from "../slot/slot";
import { useCollapsibleContent } from "./collapsible-context";

export const CollapsibleContent = (props: BaseProps<"div", EmptyProps, "id">) => {
  const { children, className, style, ...rest } = props;

  const { id, mounted, status, disabled, duration, setContentElem } = useCollapsibleContent();

  const elemRef = useRef<HTMLElement>(null);
  const refs = useMergeRefs(elemRef, setContentElem);

  const heightRef = useRef<number | undefined>(0);
  const height = heightRef.current;
  const widthRef = useRef<number | undefined>(0);
  const width = widthRef.current;

  useLayoutEffect(() => {
    const node = elemRef.current;

    if (!node) {
      return;
    }

    const rect = node.getBoundingClientRect();
    heightRef.current = rect.height;
    widthRef.current = rect.width;
  }, [mounted]);

  return (
    mounted && (
      <div
        id={id}
        ref={refs}
        data-disabled={dataAttr(disabled)}
        className={clsx(
          status == "open"
            ? "animate-[slide-down_var(--duration-var)_ease-out]"
            : "animate-[slide-up_var(--duration-var)_ease-out]",
          className,
        )}
        style={
          {
            ...style,
            "--duration-var": `${duration + 100}ms`,
            "--slide-width": width ? `${width}px` : undefined,
            "--slide-height": height ? `${height}px` : undefined,
          } as CSSProperties
        }
        {...rest}
      >
        {children}
      </div>
    )
  );
};
