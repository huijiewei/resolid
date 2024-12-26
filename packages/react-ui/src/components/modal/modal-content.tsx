import { FloatingFocusManager } from "@floating-ui/react";
import { type CSSProperties, useEffect } from "react";
import { clsx } from "../../utils/classed";
import { useFloatingAria } from "../floating/floating-aria-context";
import type { BaseProps } from "../slot/slot";
import { useModal } from "./modal-context";

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

  const { labelId } = useFloatingAria();

  useEffect(() => {
    if (!opened) {
      finalFocus?.current?.focus();
    }
  }, [opened, finalFocus]);

  return (
    <div
      className={clsx(
        "z-modal fixed left-0 top-0 flex w-screen justify-center",
        centered ? "items-center" : "items-start",
        scrollBehavior == "inside" ? "h-screen" : "h-full overflow-y-auto",
      )}
    >
      <FloatingFocusManager initialFocus={initialFocus} returnFocus={finalFocus == undefined} context={context}>
        <section
          className={clsx(
            "border-bd-normal bg-bg-normal flex flex-col rounded border shadow outline-none",
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
          })}
        >
          {children}
        </section>
      </FloatingFocusManager>
    </div>
  );
};
