import { FloatingFocusManager } from "@floating-ui/react";
import { __DEV__ } from "@resolid/utils";
import type { CSSProperties } from "react";
import { clsx } from "../../utils/classed";
import { useFloatingAria } from "../floating/FloatingAriaContext";
import { Portal } from "../portal/Portal";
import type { BaseProps } from "../slot/Slot";
import { usePopoverFloating } from "./PopoverContext";

export const PopoverContent = (props: BaseProps<"div">) => {
  const { children, className, ...rest } = props;

  const { floatingStyles, duration, mounted, status, setFloating, context, getFloatingProps, modal, initialFocus } =
    usePopoverFloating();

  const { labelId, descriptionId } = useFloatingAria();

  return (
    <>
      {mounted && (
        <Portal>
          <FloatingFocusManager modal={modal} initialFocus={initialFocus} context={context}>
            <div
              className={clsx(
                "transition-opacity duration-[--duration-var]",
                status == "open" ? "opacity-100" : "opacity-0",
              )}
              style={{ ...floatingStyles, "--duration-var": `${duration}ms` } as CSSProperties}
              ref={setFloating}
              {...getFloatingProps({
                ...rest,
                "aria-labelledby": labelId,
                "aria-describedby": descriptionId,
              })}
            >
              <div
                className={clsx("border-bd-normal bg-bg-normal relative rounded border shadow outline-none", className)}
              >
                {children}
              </div>
            </div>
          </FloatingFocusManager>
        </Portal>
      )}
    </>
  );
};

if (__DEV__) {
  PopoverContent.displayName = "PopoverContent";
}
