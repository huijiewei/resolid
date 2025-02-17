import { Turnstile, type TurnstileInstance, type TurnstileProps } from "@marsidev/react-turnstile";
import type { RefObject } from "react";

type TurnstileWidgetProps = Omit<TurnstileProps, "siteKey"> & { ref?: RefObject<TurnstileInstance | null> };

export const TurnstileWidget = ({ ref, ...rest }: TurnstileWidgetProps) => {
  return <Turnstile ref={ref} siteKey={import.meta.env.VITE_TURNSTILE_KEY} {...rest} />;
};
