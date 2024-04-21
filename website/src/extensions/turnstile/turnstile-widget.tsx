import { Turnstile, type TurnstileInstance, type TurnstileProps } from "@marsidev/react-turnstile";
import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";

export const TurnstileWidget = forwardRef<TurnstileInstance, Omit<TurnstileProps, "siteKey">>((props, ref) => {
  const { ...rest } = props;

  return <Turnstile ref={ref} siteKey={import.meta.env.VITE_TURNSTILE_KEY} {...rest} />;
});

if (__DEV__) {
  TurnstileWidget.displayName = "TurnstileWidget";
}
