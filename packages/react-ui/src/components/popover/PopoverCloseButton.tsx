import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { clsx } from "../../utils/classed";
import { CloseButton } from "../close-button/CloseButton";
import { useFloatingDispatch } from "../floating/floatingDispatchContext";
import type { BaseProps, EmptyProps } from "../slot/Slot";

export const PopoverCloseButton = forwardRef<HTMLButtonElement, BaseProps<"button", EmptyProps, "type">>(
  (props, ref) => {
    const { children, className, ...rest } = props;

    const { close } = useFloatingDispatch();

    return (
      <CloseButton
        onClick={() => close()}
        ref={ref}
        size={"1.25rem"}
        className={clsx("absolute right-1 top-1 rounded p-0.5", className)}
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
