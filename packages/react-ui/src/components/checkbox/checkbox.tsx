import { __DEV__ } from "@resolid/utils";
import {
  type CSSProperties,
  type ChangeEvent,
  type ReactElement,
  cloneElement,
  forwardRef,
  useCallback,
  useRef,
} from "react";
import { useControllableState, useIsomorphicEffect, useMergeRefs } from "../../hooks";
import {
  disabledStyles,
  peerFocusRingStyles,
  sharedCheckboxRadioColorStyles,
  sharedCheckboxRadioSizeStyles,
} from "../../shared/styles";
import { clsx } from "../../utils/classed";
import type { BaseProps } from "../slot/slot";
import { type CheckboxBaseProps, useCheckboxGroup } from "./checkbox-group-context";
import { CheckboxIcon } from "./checkbox-icon";

export type CheckboxProps = CheckboxBaseProps & {
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
   * 部分选中
   * @default false
   */
  indeterminate?: boolean;

  /**
   * 图标
   * @default CheckboxIcon
   */
  icon?: ReactElement;

  /**
   * onChange 回调
   */
  onChange?: (checked: boolean) => void;
};

const checkboxSizeStyles = {
  xs: { ...sharedCheckboxRadioSizeStyles.xs, icon: "text-[0.45rem]" },
  sm: { ...sharedCheckboxRadioSizeStyles.sm, icon: "text-[0.5rem]" },
  md: { ...sharedCheckboxRadioSizeStyles.md, icon: "text-[0.625rem]" },
  lg: { ...sharedCheckboxRadioSizeStyles.lg, icon: "text-[0.75rem]" },
  xl: { ...sharedCheckboxRadioSizeStyles.xl, icon: "text-[0.875rem]" },
};

const checkboxColorStyles = sharedCheckboxRadioColorStyles;

export const Checkbox = forwardRef<HTMLInputElement, BaseProps<"input", CheckboxProps, "role" | "type">>(
  (props, ref) => {
    const group = useCheckboxGroup();

    const {
      size = group?.size || "md",
      color = group?.color || "primary",
      disabled = group?.disabled || false,
      spacing = "0.5em",
      className,
      children,
      icon = <CheckboxIcon />,

      value,
      checked,
      defaultChecked = false,
      indeterminate,
      onChange,
      required = false,
      invalid = false,
      style,
      ...rest
    } = props;

    const inputRef = useRef<HTMLInputElement>(null);

    const [state, setState] = useControllableState({
      value: group?.value && value ? group.value.includes(value) : checked,
      defaultValue: defaultChecked,
      onChange,
    });

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        setState(indeterminate ? true : event.target.checked);

        group?.onChange(event);
      },
      [group, indeterminate, setState],
    );

    useIsomorphicEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = Boolean(indeterminate);
      }
    }, [indeterminate]);

    useIsomorphicEffect(() => {
      if (!inputRef.current) {
        return;
      }

      const notInSync = inputRef.current.checked !== state;

      if (notInSync) {
        setState(inputRef.current.checked);
      }
    }, [setState, state]);

    const sizeStyle = checkboxSizeStyles[size];
    const colorStyle = checkboxColorStyles[color];

    const clonedIcon = cloneElement(icon, {
      indeterminate: indeterminate,
      className: clsx(sizeStyle.icon, "transition-opacity", state || indeterminate ? "opacity-100" : "opacity-0"),
    });

    const refs = useMergeRefs(inputRef, ref);

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
          ref={refs}
          className={"peer sr-only"}
          value={value}
          type="checkbox"
          checked={state}
          disabled={disabled}
          required={required}
          onChange={handleChange}
          {...rest}
        />
        <div
          className={clsx(
            "inline-flex shrink-0 select-none items-center justify-center rounded border-2 transition-colors",
            peerFocusRingStyles,
            colorStyle.focus,
            invalid ? "border-bd-invalid" : state || indeterminate ? colorStyle.border : "border-bd-normal",
            state || indeterminate ? `${colorStyle.checked} text-fg-emphasized` : "bg-bg-normal",
            disabled && disabledStyles,
            sizeStyle.control,
          )}
        >
          {clonedIcon}
        </div>
        {children && <span className={clsx(sizeStyle.label, disabled && disabledStyles)}>{children}</span>}
      </label>
    );
  },
);

if (__DEV__) {
  Checkbox.displayName = "Checkbox";
}
