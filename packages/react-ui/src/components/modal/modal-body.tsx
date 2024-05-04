import { forwardRef } from "react";
import { clsx } from "../../utils/classed";
import type { BaseProps, EmptyProps } from "../slot/slot";
import { useModal } from "./modal-context";

export const ModalBody = forwardRef<HTMLDivElement, BaseProps<"div", EmptyProps, "id">>((props, ref) => {
  const { children, className, ...rest } = props;

  const { scrollBehavior } = useModal();

  return (
    <div
      ref={ref}
      className={clsx(
        "flex-1",
        scrollBehavior == "inside" && "scrollbar scrollbar-thin overflow-y-auto overscroll-contain",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
