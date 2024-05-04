import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { clsx } from "../../utils/classed";
import { CloseButton } from "../close-button/close-button";
import { useFloatingDispatch } from "../floating/floating-dispatch-context";
import type { BaseProps, EmptyProps } from "../slot/slot";

export const PopoverCloseButton = forwardRef<HTMLButtonElement, BaseProps<"button", EmptyProps, "type">>(
  (props, ref) => {
    const { children, className, ...rest } = props;

    const { close } = useFloatingDispatch();

    return (
      <CloseButton
        onClick={() => close()}
        ref={ref}
        size={"1.125rem"}
        className={clsx("absolute top-1.5 right-1.5 rounded-full p-1", className)}
        {...rest}
      >
        {children}
      </CloseButton>
    );
  },
);

if (__DEV__) {
  PopoverCloseButton.displayName = "PopoverCloseButton";
}
