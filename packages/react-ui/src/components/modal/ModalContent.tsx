import { FloatingFocusManager } from "@floating-ui/react";
import { __DEV__ } from "@resolid/utils";
import { forwardRef, useEffect, type CSSProperties } from "react";
import { useMergeRefs } from "../../hooks";
import { clsx } from "../../utils/classed";
import { useFloatingAria } from "../floating/FloatingAriaContext";
import type { BaseProps } from "../slot/Slot";
import { useModal } from "./ModalContext";

export const ModalContent = forwardRef<HTMLDivElement, BaseProps<"div">>((props, ref) => {
  const { children, className, style, ...rest } = props;
  const {
    opened,
    centered,
    status,
    duration,
    setFloating,
    context,
    getFloatingProps,
    initialFocus,
    finalFocus,
    scrollBehavior,
  } = useModal();

  const { labelId, descriptionId } = useFloatingAria();

  useEffect(() => {
    if (!opened) {
      finalFocus && finalFocus.current?.focus();
    }
  }, [opened, finalFocus]);

  const refs = useMergeRefs(ref, setFloating);

  return (
    <div
      className={clsx(
        "fixed left-0 top-0 z-modal flex w-screen justify-center",
        centered ? "items-center" : "items-start",
        scrollBehavior == "inside" ? "h-screen" : "h-full overflow-y-auto",
      )}
    >
      <FloatingFocusManager initialFocus={initialFocus} returnFocus={finalFocus == undefined} context={context}>
        <div
          className={clsx(
            "relative flex flex-col rounded border border-bg-muted bg-bg-normal shadow outline-none",
            centered ? "my-6" : "my-16",
            scrollBehavior == "inside" && (centered ? "max-h-[calc(100%-2rem)]" : "max-h-[calc(100%-7rem)]"),
            "transition-opacity duration-[--duration-var]",
            status == "open" ? "opacity-1" : "opacity-0",
            className,
          )}
          style={{ ...style, "--duration-var": `${duration}ms` } as CSSProperties}
          ref={refs}
          {...getFloatingProps({
            ...rest,
            "aria-labelledby": labelId,
            "aria-describedby": descriptionId,
          })}
        >
          {children}
        </div>
      </FloatingFocusManager>
    </div>
  );
});

if (__DEV__) {
  ModalContent.displayName = "ModalContent";
}
