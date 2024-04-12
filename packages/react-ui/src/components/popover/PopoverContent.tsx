import { FloatingFocusManager } from "@floating-ui/react";
import { __DEV__ } from "@resolid/utils";
import type { CSSProperties } from "react";
import { clsx } from "../../utils/classed";
import { useFloatingAria } from "../floating/floatingAriaContext";
import { Portal } from "../portal/Portal";
import type { BaseProps } from "../slot/Slot";
import { usePopoverFloating } from "./popoverContext";

export const PopoverContent = (props: BaseProps<"div">) => {
  const { children, className, ...rest } = props;

  const {
    floatingStyles,
    duration,
    trigger,
    mounted,
    status,
    setFloating,
    context,
    getFloatingProps,
    modal,
    initialFocus,
  } = usePopoverFloating();

  const { labelId, descriptionId } = useFloatingAria();

  const popoverInner = (
    <div
      className={clsx("transition-opacity duration-[--duration-var]", status == "open" ? "opacity-100" : "opacity-0")}
      style={{ ...floatingStyles, "--duration-var": `${duration}ms` } as CSSProperties}
      ref={setFloating}
      {...getFloatingProps({
        ...rest,
        "aria-labelledby": labelId,
        "aria-describedby": descriptionId,
      })}
    >
      <div className={clsx("relative rounded border border-bd-normal bg-bg-normal shadow outline-none", className)}>
        {children}
      </div>
    </div>
  );

  return (
    <>
      {mounted && (
        <Portal>
          {trigger == "click" ? (
            <FloatingFocusManager modal={modal} initialFocus={initialFocus} context={context}>
              {popoverInner}
            </FloatingFocusManager>
          ) : (
            popoverInner
          )}
        </Portal>
      )}
    </>
  );
};

if (__DEV__) {
  PopoverContent.displayName = "PopoverContent";
}
