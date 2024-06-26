import { FloatingOverlay } from "@floating-ui/react";
import type { CSSProperties } from "react";
import { RemoveScrollBar } from "react-remove-scroll-bar";
import { clsx } from "../../utils/classed";
import type { BaseProps } from "../slot/slot";
import { useModal } from "./modal-context";

export const ModalOverlay = (props: BaseProps<"div">) => {
  const { className, style, ...rest } = props;

  const { lockScroll, status, duration } = useModal();

  return (
    <>
      {lockScroll && <RemoveScrollBar />}
      <FloatingOverlay
        style={{ ...style, "--duration-var": `${duration}ms` } as CSSProperties}
        className={clsx(
          "z-modal bg-black/75 transition-opacity duration-[--duration-var]",
          status == "open" ? "opacity-100" : "opacity-0",
          className,
        )}
        {...rest}
      />
    </>
  );
};
