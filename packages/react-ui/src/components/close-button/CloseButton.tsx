import { __DEV__, isNumber } from "@resolid/utils";
import { forwardRef } from "react";
import { clsx } from "../../utils/classed";
import type { BaseProps } from "../slot/Slot";

export type CloseButtonProps = {
  textClassName?: string;
  statusClassName?: string;
  size?: string | number;
};

export const CloseButton = forwardRef<HTMLButtonElement, BaseProps<"button", CloseButtonProps, "type">>(
  (props, ref) => {
    const {
      className,
      disabled,
      textClassName = "text-fg-muted",
      statusClassName = "hover:bg-bg-subtle active:bg-bg-muted",
      size = "1.5rem",
      children,
      ...rest
    } = props;

    const sizeValue = isNumber(size) ? `${size}px` : size;

    return (
      <button
        type={"button"}
        disabled={disabled}
        ref={ref}
        className={clsx(
          "flex shrink-0 appearance-none items-center justify-center rounded outline-none transition-colors",
          textClassName,
          !disabled && `focus-visible:ring ${statusClassName}`,
          className,
        )}
        {...rest}
      >
        {children || (
          <svg
            width={sizeValue}
            height={sizeValue}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </button>
    );
  },
);

if (__DEV__) {
  CloseButton.displayName = "CloseButton";
}
