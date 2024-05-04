import { __DEV__ } from "@resolid/utils";
import { type CSSProperties, type ChangeEvent, forwardRef, useCallback } from "react";
import { useControllableState } from "../../hooks";
import {
  disabledStyles,
  peerFocusRingStyles,
  sharedCheckboxRadioColorStyles,
  sharedCheckboxRadioSizeStyles,
} from "../../shared/styles";
import { clsx } from "../../utils/classed";
import type { BaseProps } from "../slot/slot";
import { type RadioBaseProps, useRadioGroup } from "./radio-group-context";

export type RadioProps = RadioBaseProps & {
  /**
   * 值
   */
  value?: string | number;

  /**
   * 是否必选
   * @default false
   */
  required?: boolean;

  /**
   * 是否无效
   * @default false
   */
  invalid?: boolean;

  /**
   * 间距
   * @default '0.5em'
   */
  spacing?: string | number;

  /**
   * onChange 回调
   */
  onChange?: (checked: boolean) => void;
};

const radioSizeStyles = sharedCheckboxRadioSizeStyles;

const radioColorStyles = sharedCheckboxRadioColorStyles;

export const Radio = forwardRef<HTMLInputElement, BaseProps<"input", RadioProps, "role" | "type">>((props, ref) => {
  const group = useRadioGroup();

  const {
    name = group?.name,
    size = group?.size || "md",
    color = group?.color || "primary",
    disabled = group?.disabled || false,
    spacing = "0.5em",
    className,
    children,

    value,
    checked,
    defaultChecked = false,
    onChange,
    required = false,
    invalid = false,
    style,
    ...rest
  } = props;

  const [state, setState] = useControllableState({
    value: group ? group.value == value : checked,
    defaultValue: defaultChecked,
    onChange,
  });

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setState(event.target.checked);

      group?.onChange(event);
    },
    [group, setState],
  );

  const sizeStyle = radioSizeStyles[size];
  const colorStyle = radioColorStyles[color];

  return (
    <label
      style={
        {
          "--spacing-var": `${spacing}`,
          ...style,
        } as CSSProperties
      }
      className={clsx(
        "relative inline-flex items-center gap-[--spacing-var]",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className,
      )}
    >
      <input
        ref={ref}
        name={name}
        className={"peer sr-only"}
        value={value}
        type={"radio"}
        checked={state}
        disabled={disabled}
        required={required}
        onChange={handleChange}
        {...rest}
      />
      <span
        className={clsx(
          "inline-flex shrink-0 select-none items-center justify-center rounded-full border-2",
          peerFocusRingStyles,
          colorStyle.focus,
          invalid ? "border-bd-invalid" : state ? colorStyle.border : "border-bd-normal",
          state ? ["text-fg-emphasized", colorStyle.checked] : "bg-bg-normal",
          disabled && disabledStyles,
          sizeStyle.control,
          state &&
            `before:relative before:inline-block before:h-1/2 before:w-1/2 before:rounded-[50%] before:bg-current before:content-['']`,
        )}
      />
      {children && <span className={clsx(sizeStyle.label, disabled && disabledStyles)}>{children}</span>}
    </label>
  );
});

if (__DEV__) {
  Radio.displayName = "Radio";
}
