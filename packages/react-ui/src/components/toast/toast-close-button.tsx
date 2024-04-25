import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { clsx } from "../../utils/classed";
import { useAlert } from "../alert/alert-context";
import { CloseButton } from "../close-button/close-button";
import { useFloatingDispatch } from "../floating/floating-dispatch-context";
import type { BaseProps, EmptyProps } from "../slot/slot";

const toastColorStyles = {
  neutral: (solid: boolean) =>
    solid
      ? "hover:bg-bg-neutral-emphasis-hovered active:bg-bg-neutral-emphasis-pressed"
      : "hover:bg-bg-neutral-hovered active:bg-bg-neutral-pressed",
  primary: (solid: boolean) =>
    solid
      ? "hover:bg-bg-primary-emphasis-hovered active:bg-bg-primary-emphasis-pressed"
      : "hover:bg-bg-primary-hovered active:bg-bg-primary-pressed",
  success: (solid: boolean) =>
    solid
      ? "hover:bg-bg-success-emphasis-hovered active:bg-bg-success-emphasis-pressed"
      : "hover:bg-bg-success-hovered active:bg-bg-success-pressed",
  warning: (solid: boolean) =>
    solid
      ? "hover:bg-bg-warning-emphasis-hovered active:bg-bg-warning-emphasis-pressed"
      : "hover:bg-bg-warning-hovered active:bg-bg-warning-pressed",
  danger: (solid: boolean) =>
    solid
      ? "hover:bg-bg-danger-emphasis-hovered active:bg-bg-danger-emphasis-pressed"
      : "hover:bg-bg-danger-hovered active:bg-bg-danger-pressed",
};

export const ToastCloseButton = forwardRef<HTMLButtonElement, BaseProps<"button", EmptyProps, "type">>((props, ref) => {
  const { children, className, ...rest } = props;

  const { close } = useFloatingDispatch();
  const { color, variant } = useAlert();

  return (
    <CloseButton
      onClick={() => close()}
      ref={ref}
      size={"1.25rem"}
      textClassName={variant == "solid" ? "text-fg-emphasized" : undefined}
      statusClassName={toastColorStyles[color!](variant == "solid")}
      className={clsx("absolute right-1 top-1 rounded p-0.5", className)}
      {...rest}
    >
      {children}
    </CloseButton>
  );
});

if (__DEV__) {
  ToastCloseButton.displayName = "ToastCloseButton";
}
