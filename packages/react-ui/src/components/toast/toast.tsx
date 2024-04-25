import { AlertDescription, AlertTitle } from "../alert/alert";
import { useFloatingAria } from "../floating/floating-aria-context";
import type { BaseProps, EmptyProps } from "../slot/slot";
import { ToastCloseButton } from "./toast-close-button";
import { ToastRoot, type ToastRootProps } from "./toast-root";

export type ToastProps = ToastRootProps;

export const Toast = ToastRoot;

export const ToastTitle = (props: BaseProps<"div", EmptyProps, "id">) => {
  const { labelId } = useFloatingAria();

  return <AlertTitle id={labelId} {...props} />;
};

export const ToastDescription = (props: BaseProps<"div", EmptyProps, "id">) => {
  const { descriptionId } = useFloatingAria();

  return <AlertDescription id={descriptionId} {...props} />;
};

export { ToastCloseButton };
