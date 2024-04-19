import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { clsx } from "../../utils/classed";
import { createContext } from "../../utils/context";
import type { BaseProps } from "../slot/slot";
import { alertStyles, type AlertStyleProps } from "./alert.styles";

type AlertContext = {
  /**
   * 外观
   * @default 'soft'
   */
  variant?: AlertStyleProps["variant"];
};

export type AlertProps = AlertContext & {
  /**
   * 颜色
   * @default 'primary'
   */
  color?: AlertStyleProps["color"];
};

const [AlertProvider, useAlert] = createContext<AlertContext>({
  strict: true,
  name: "AlertContext",
});

export const Alert = forwardRef<HTMLDivElement, BaseProps<"div", AlertProps, "role">>((props, ref) => {
  const { children, className, color = "primary", variant = "soft", ...rest } = props;
  return (
    <div ref={ref} role={"alert"} className={clsx(alertStyles({ color, variant }), className)} {...rest}>
      <AlertProvider value={{ variant }}>{children}</AlertProvider>
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

  return <span className={clsx(`shrink-0`, className)} {...rest} />;
};

if (__DEV__) {
  AlertIcon.displayName = "AlertIcon";
}
