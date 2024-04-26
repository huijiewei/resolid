import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { clsx } from "../../utils/classed";
import type { BaseProps } from "../slot/slot";
import { type AlertContext, AlertProvider, useAlert } from "./alert-context";
import { alertStyles } from "./alert.styles";

export type AlertProps = AlertContext;

export const Alert = forwardRef<HTMLDivElement, BaseProps<"div", AlertProps, "role">>((props, ref) => {
  const { children, className, color = "primary", variant = "soft", ...rest } = props;
  return (
    <div ref={ref} role={"alert"} className={clsx(alertStyles({ color, variant }), className)} {...rest}>
      <AlertProvider value={{ variant, color }}>{children}</AlertProvider>
    </div>
  );
});

if (__DEV__) {
  Alert.displayName = "Alert";
}

export const AlertTitle = (props: BaseProps<"div">) => {
  const { className, ...rest } = props;

  return <div className={clsx("font-medium", className)} {...rest} />;
};

if (__DEV__) {
  AlertTitle.displayName = "AlertTitle";
}

export const AlertDescription = (props: BaseProps<"div">) => {
  const { className, ...rest } = props;

  const { variant } = useAlert();

  return <div className={clsx(variant != "solid" ? "text-fg-normal" : "text-fg-emphasized", className)} {...rest} />;
};

if (__DEV__) {
  AlertDescription.displayName = "AlertDescription";
}

export const AlertIcon = (props: BaseProps<"span">) => {
  const { className, ...rest } = props;

  return <span className={clsx("shrink-0", className)} {...rest} />;
};

if (__DEV__) {
  AlertIcon.displayName = "AlertIcon";
}
