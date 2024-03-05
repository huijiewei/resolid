import { FloatingFocusManager, useTransitionStatus } from "@floating-ui/react";
import { __DEV__ } from "@resolid/utils";
import { forwardRef, type CSSProperties } from "react";
import { useMergeRefs } from "../../hooks";
import { clsx } from "../../utils/classed";
import { useFloatingAria } from "../floating/FloatingAriaContext";
import { Portal } from "../portal/Portal";
import type { BaseProps } from "../slot/Slot";
import { usePopoverFloating } from "./PopoverContext";

export const PopoverContent = forwardRef<HTMLDivElement, BaseProps<"div">>((props, ref) => {
  const { children, className, ...rest } = props;

  const { floatingStyles, duration, setFloating, context, getFloatingProps, modal, initialFocus } =
    usePopoverFloating();

  const { labelId, descriptionId } = useFloatingAria();

  const refs = useMergeRefs(setFloating, ref);

  const { isMounted, status } = useTransitionStatus(context, {
    duration: duration,
  });

  return (
    <>
      {isMounted && (
        <Portal>
          <FloatingFocusManager modal={modal} initialFocus={initialFocus} context={context}>
            <div
              className={clsx(
                "transition-opacity duration-[--duration-var]",
                status == "open" ? "opacity-1" : "opacity-0",
              )}
              style={{ ...floatingStyles, "--duration-var": `${duration}ms` } as CSSProperties}
              ref={refs}
              {...getFloatingProps({
                ...rest,
                "aria-labelledby": labelId,
                "aria-describedby": descriptionId,
              })}
            >
              <div
                className={clsx("relative rounded border border-bg-muted bg-bg-normal shadow outline-none", className)}
              >
                {children}
              </div>
            </div>
          </FloatingFocusManager>
        </Portal>
      )}
    </>
  );
});

if (__DEV__) {
  PopoverContent.displayName = "PopoverContent";
}
