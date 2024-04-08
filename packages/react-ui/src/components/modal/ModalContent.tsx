import { FloatingFocusManager } from "@floating-ui/react";
import { __DEV__ } from "@resolid/utils";
import { useEffect, type CSSProperties } from "react";
import { clsx } from "../../utils/classed";
import { useFloatingAria } from "../floating/floatingAriaContext";
import type { BaseProps } from "../slot/Slot";
import { useModal } from "./modalContext";

export const ModalContent = (props: BaseProps<"div">) => {
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
            "relative flex flex-col rounded border border-bd-normal bg-bg-normal shadow outline-none",
            centered ? "my-6" : "my-16",
            scrollBehavior == "inside" && (centered ? "max-h-[calc(100%-2rem)]" : "max-h-[calc(100%-7rem)]"),
            "transition-opacity duration-[--duration-var]",
            status == "open" ? "opacity-100" : "opacity-0",
            className,
          )}
          style={{ ...style, "--duration-var": `${duration}ms` } as CSSProperties}
          ref={setFloating}
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
};

if (__DEV__) {
  ModalContent.displayName = "ModalContent";
}
