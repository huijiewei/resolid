import { __DEV__ } from "@resolid/utils";
import { type CSSProperties, type ChangeEvent, forwardRef, useCallback } from "react";
import { useControllableState } from "../../hooks";
import { disabledStyles, peerFocusRingStyles, sharedSwitchCheckboxRadioColorStyles } from "../../shared/styles";
import { clsx } from "../../utils/classed";
import type { Color, Size } from "../../utils/types";
import type { BaseProps } from "../slot/slot";

export type SwitchProps = {
  /**
   * 大小
   * @default 'md'
   */
  size?: Size;

  /**
   * 颜色
   * @default 'primary'
   */
  color?: Color;

  /**
   * 间距
   * @default '0.5em'
   */
  spacing?: string | number;

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;

  /**
   * 是否只读
   * @default false
   */
  readOnly?: boolean;

  /**
   * onChange 回调
   */
  onChange?: (value: boolean) => void;
};

const switchSizeStyles = {
  xs: { track: "h-4 w-8", thumb: "translate-x-4", label: "text-xs" },
  sm: { track: "h-5 w-10", thumb: "translate-x-5", label: "text-sm" },
  md: { track: "h-6 w-12", thumb: "translate-x-6", label: "text-base" },
  lg: { track: "h-7 w-14", thumb: "translate-x-7", label: "text-base" },
  xl: { track: "h-8 w-16", thumb: "translate-x-8", label: "text-lg" },
};

const switchColorStyles = sharedSwitchCheckboxRadioColorStyles;

export const Switch = forwardRef<HTMLInputElement, BaseProps<"input", SwitchProps, "role" | "type">>((props, ref) => {
  const {
    color = "primary",
    size = "md",
    spacing = "0.5em",
    disabled,
    readOnly,
    checked,
    defaultChecked = false,
    value,
    onChange,
    children,
    className,
    ...rest
  } = props;

  const [state, setState] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange,
  });

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (readOnly || disabled) {
        event.preventDefault();
        return;
      }

      setState(event.target.checked);
    },
    [readOnly, disabled, setState],
  );

  const sizeStyle = switchSizeStyles[size];
  const colorStyle = switchColorStyles[color];

  return (
    <label
      style={
        {
          "--spacing-var": `${spacing}`,
        } as CSSProperties
      }
      className={clsx(
        "relative inline-flex items-center gap-[--spacing-var]",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className,
      )}
    >
      <input
        className={"peer sr-only"}
        value={value}
        type="checkbox"
        ref={ref}
        checked={state}
        disabled={disabled}
        readOnly={readOnly}
        onChange={handleChange}
        role={"switch"}
        {...rest}
      />
      <span
        className={clsx(
          "inline-flex shrink-0 justify-start rounded-full p-[2px] transition-colors",
          peerFocusRingStyles,
          colorStyle.focus,
          sizeStyle.track,
          state ? colorStyle.checked : "bg-bg-muted",
          disabled && disabledStyles,
        )}
      >
        <span
          className={clsx(
            "aspect-square h-full rounded-[inherit] bg-bg-normal transition-transform",
            state && sizeStyle.thumb,
          )}
        />
      </span>
      {children && <span className={clsx(sizeStyle.label, disabled && disabledStyles)}>{children}</span>}
    </label>
  );
});

if (__DEV__) {
  Switch.displayName = "Switch";
}
