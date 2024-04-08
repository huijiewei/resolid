import { __DEV__ } from "@resolid/utils";
import { forwardRef, useCallback, type CSSProperties, type ChangeEvent } from "react";
import { useControllableState } from "../../hooks";
import { clsx } from "../../utils/classed";
import type { BaseProps } from "../slot/Slot";
import { useRadioGroup, type RadioBaseProps } from "./radioGroupContext";

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

const radioSizeStyles = {
  xs: { control: "h-3.5 w-3.5", label: "text-xs" },
  sm: { control: "h-4 w-4", label: "text-sm" },
  md: { control: "h-5 w-5", label: "text-base" },
  lg: { control: "h-6 w-6", label: "text-base" },
  xl: { control: "h-7 w-7", label: "text-lg" },
};

const radioColorStyles = {
  primary: {
    focus: "peer-focus-visible:ring-bg-primary-emphasis/35",
    checked: "bg-bg-primary-emphasis",
    border: "border-bg-primary-emphasis",
  },
  neutral: {
    focus: "peer-focus-visible:ring-bg-neutral-emphasis/35",
    checked: "bg-bg-neutral-emphasis",
    border: "border-bg-neutral-emphasis",
  },
  success: {
    focus: "peer-focus-visible:ring-bg-success-emphasis/35",
    checked: "bg-bg-success-emphasis",
    border: "border-bg-success-emphasis",
  },
  warning: {
    focus: "peer-focus-visible:ring-bg-warning-emphasis/35",
    checked: "bg-bg-warning-emphasis",
    border: "border-bg-warning-emphasis",
  },
  danger: {
    focus: "peer-focus-visible:ring-bg-danger-emphasis/35",
    checked: "bg-bg-danger-emphasis",
    border: "border-bg-danger-emphasis",
  },
};

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
          "peer-focus-visible:ring",
          invalid ? "border-bd-invalid" : state ? colorStyle.border : "border-bd-normal",
          state ? `${colorStyle.checked} text-fg-emphasized` : "bg-bg-normal",
          disabled && "opacity-70 grayscale-[30%]",
          sizeStyle.control,
          state &&
            `before:relative before:inline-block before:h-1/2 before:w-1/2 before:rounded-[50%] before:bg-current before:content-['']`,
        )}
      />
      {children && <span className={clsx(sizeStyle.label, disabled && "opacity-70 grayscale-[30%]")}>{children}</span>}
    </label>
  );
});

if (__DEV__) {
  Radio.displayName = "Radio";
}
