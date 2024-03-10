import { FloatingOverlay } from "@floating-ui/react";
import { __DEV__ } from "@resolid/utils";
import { forwardRef, type CSSProperties } from "react";
import { RemoveScrollBar } from "react-remove-scroll-bar";
import { clsx } from "../../utils/classed";
import type { BaseProps } from "../slot/Slot";
import { useModal } from "./ModalContext";

export const ModalOverlay = forwardRef<HTMLDivElement, BaseProps<"div">>((props, ref) => {
  const { className, style, ...rest } = props;

  const { lockScroll, status, duration } = useModal();

  return (
    <>
      {lockScroll && <RemoveScrollBar />}
      <FloatingOverlay
        ref={ref}
        style={{ ...style, "--duration-var": `${duration}ms` } as CSSProperties}
        className={clsx(
          "z-overlay bg-bg-emphasized/60 transition-opacity duration-[--duration-var]",
          status == "open" ? "opacity-1" : "opacity-0",
          className,
        )}
        {...rest}
      />
    </>
  );
});

if (__DEV__) {
  ModalOverlay.displayName = "ModalOverlay";
}