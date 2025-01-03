import { useTransitionStatus } from "@floating-ui/react";
import { __DEV__ } from "@resolid/utils";
import type { CSSProperties } from "react";
import { clsx } from "../../utils/classed";
import { Portal } from "../portal/portal";
import type { BaseProps } from "../slot/slot";
import { useTooltipFloating } from "./tooltip-context";

export const TooltipContent = (props: BaseProps<"div">) => {
  const { children, className, ...rest } = props;

  const { floatingStyles, floatingClass, duration, setFloating, context, getFloatingProps } = useTooltipFloating();

  const { isMounted, status } = useTransitionStatus(context, {
    duration: duration,
  });

  return (
    <>
      {isMounted && (
        <Portal>
          <div
            className={clsx(
              "z-tooltip text-fg-emphasized inline-block max-w-96 rounded border px-2 py-1 text-sm shadow",
              floatingClass,
              "transition-opacity duration-[--duration-var]",
              status == "open" ? "opacity-100" : "opacity-0",
              className,
            )}
            ref={setFloating}
            style={
              {
                ...floatingStyles,
                "--duration-var": `${duration}ms`,
              } as CSSProperties
            }
            {...getFloatingProps({
              ...rest,
            })}
          >
            {children}
          </div>
        </Portal>
      )}
    </>
  );
};

if (__DEV__) {
  TooltipContent.displayName = "TooltipContent";
}
