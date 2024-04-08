import { __DEV__ } from "@resolid/utils";
import { clsx } from "../../utils/classed";
import type { BaseProps } from "../slot/Slot";
import { Spinner } from "../spinner/Spinner";
import type { ButtonStyleProps } from "./button.styles";

export type ButtonSpinnerProps = {
  size: NonNullable<ButtonStyleProps["size"]>;
  label?: string;
};

const SpinnerSizes: Record<string, ButtonSpinnerProps["size"]> = {
  xs: "xs",
  sm: "xs",
  md: "sm",
  lg: "md",
  xl: "lg",
};

export const ButtonSpinner = (props: BaseProps<"span", ButtonSpinnerProps>) => {
  const { label, size, className, children = <Spinner size={SpinnerSizes[size]} />, ...rest } = props;

  return (
    <span className={clsx("flex items-center justify-center", label ? "relative" : "absolute", className)} {...rest}>
      {children}
    </span>
  );
};

if (__DEV__) {
  ButtonSpinner.displayName = "ButtonSpinner";
}
