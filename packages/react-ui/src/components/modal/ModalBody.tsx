import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { clsx } from "../../utils/classed";
import { useFloatingAria } from "../floating/FloatingAriaContext";
import type { BaseProps, EmptyProps } from "../slot/Slot";
import { useModal } from "./ModalContext";

export const ModalBody = forwardRef<HTMLDivElement, BaseProps<"div", EmptyProps, "id">>((props, ref) => {
  const { children, className, ...rest } = props;

  const { scrollBehavior } = useModal();
  const { descriptionId } = useFloatingAria();

  return (
    <div
      id={descriptionId}
      ref={ref}
      className={clsx(
        scrollBehavior == "inside" && "overflow-y-auto overscroll-contain scrollbar scrollbar-thin",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});

if (__DEV__) {
  ModalBody.displayName = "ModalBody";
}
