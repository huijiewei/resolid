import { FloatingFocusManager } from "@floating-ui/react";
import { type CSSProperties, useEffect } from "react";
import { clsx } from "../../utils/classed";
import { useFloatingAria } from "../floating/floating-aria-context";
import { useModal } from "../modal/modal-context";
import type { BaseProps } from "../slot/slot";
import { useDrawer } from "./drawer-context";

const placementStyles = {
  left: "left-0 top-0 bottom-0",
  right: "right-0 top-0 bottom-0",
  top: "top-0 left-0 right-0",
  bottom: "bottom-0 left-0 right-0",
};

const placementTransformStyles = {
  left: {
    open: "translate-x-none",
    close: "-translate-x-full",
  },
  right: {
    open: "translate-x-none",
    close: "translate-x-full",
  },
  top: {
    open: "translate-y-none",
    close: "-translate-y-full",
  },
  bottom: {
    open: "translate-y-none",
    close: "translate-y-full",
  },
};

export const DrawerContent = (props: BaseProps<"div">) => {
  const { children, className, ...rest } = props;
  const { placement } = useDrawer();
  const { labelId } = useFloatingAria();
  const { opened, status, duration, setFloating, context, getFloatingProps, initialFocus, finalFocus } = useModal();

  const transformStyle = placementTransformStyles[placement];

  useEffect(() => {
    if (!opened) {
      finalFocus?.current?.focus();
    }
  }, [opened, finalFocus]);

  return (
    <div className={clsx("fixed top-0 left-0 z-modal flex h-screen w-screen justify-center")}>
      <FloatingFocusManager initialFocus={initialFocus} returnFocus={finalFocus == undefined} context={context}>
        <div
          className={clsx(
            "fixed flex flex-col bg-bg-normal shadow",
            "transition-[opacity,transform] duration-[--duration-var] ease-in-out",
            status == "open" ? ["opacity-100", transformStyle.open] : ["opacity-0", transformStyle.close],
            placementStyles[placement],
            className,
          )}
          style={{ "--duration-var": `${duration}ms` } as CSSProperties}
          ref={setFloating}
          {...getFloatingProps({
            ...rest,
            "aria-labelledby": labelId,
          })}
        >
          {children}
        </div>
      </FloatingFocusManager>
    </div>
  );
};
