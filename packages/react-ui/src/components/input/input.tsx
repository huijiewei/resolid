import { __DEV__ } from "@resolid/utils";
import { type CSSProperties, type ChangeEvent, type ReactNode, forwardRef, useCallback, useRef } from "react";
import { useControllableState, useMergeRefs } from "../../hooks";
import { sharedInputTextStyles } from "../../shared/styles";
import { clsx } from "../../utils/classed";
import type { BaseProps } from "../slot/slot";
import { type InputGroupContext, useInputGroup } from "./input-group-context";
import { inputAdornmentDefaultSizes, inputGroupStyles, inputSizeStyles } from "./input.styles";

export type InputProps = Partial<InputGroupContext> & {
  /**
   * 可控值
   */
  value?: string | number;

  /**
   * 默认值
   */
  defaultValue?: string | number;

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;

  /**
   * 是否必须
   * @default false
   */
  required?: boolean;

  /**
   * 是否无效
   * @default false
   */
  invalid?: boolean;

  /**
   * 是否只读
   * @default false
   */
  readOnly?: boolean;

  /**
   * 是否全宽度
   * @default false
   */
  block?: boolean;

  /**
   * onChange 回调
   */
  onChange?: (value: string | number) => void;

  /**
   * 原生 HTML 大小
   */
  htmlSize?: number;

  /**
   * 占位符文本
   */
  placeholder?: string;

  /**
   * 前置元素
   */
  leading?: ReactNode;

  /**
   * 前置元素宽度
   */
  leadingWidth?: number;

  /**
   * 前置元素是否有鼠标事件
   * @default false
   */
  leadingPointer?: boolean;

  /**
   * 后置元素
   */
  trailing?: ReactNode;

  /**
   * 后置元素宽度
   */
  trailingWidth?: number;

  /**
   * 后置元素是否有鼠标事件
   * @default false
   */
  trailingPointer?: boolean;
};

export const Input = forwardRef<HTMLInputElement, BaseProps<"input", InputProps, "children">>((props, ref) => {
  const group = useInputGroup();

  const {
    size = group?.size ?? "md",
    invalid = false,
    disabled = false,
    required = false,
    readOnly = false,
    block = false,
    className,
    value,
    defaultValue = "",
    onChange,
    htmlSize,
    placeholder,
    leading,
    leadingWidth,
    leadingPointer = false,
    trailing,
    trailingWidth,
    trailingPointer = false,
    inputMode,
    ...rest
  } = props;

  const [state, setState] = useControllableState({ value, defaultValue, onChange });

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (inputMode == "decimal" && (event.nativeEvent as InputEvent).isComposing) {
        return;
      }

      if (readOnly || disabled) {
        event.preventDefault();
        return;
      }

      setState(event.target.value);
    },
    [readOnly, disabled, inputMode, setState],
  );

  const adornmentSize = inputAdornmentDefaultSizes[size];

  const inputRef = useRef<HTMLInputElement>(null);
  const refs = useMergeRefs(inputRef, ref);

  return (
    <div
      className={clsx(
        "relative inline-flex items-center rounded border transition-colors",
        "focus-within:border-bg-primary-emphasis focus-within:ring-bg-primary-emphasis focus-within:ring-1",
        block && "w-full",
        invalid && "border-bd-invalid",
        group && inputGroupStyles,
        sharedInputTextStyles[size],
        !disabled && !invalid && "hover:[&:not(:focus-within)]:border-bd-hovered",
        className,
      )}
      style={
        {
          "--leading-width": leading ? (leadingWidth ? `${leadingWidth}px` : adornmentSize) : undefined,
          "--trailing-width": trailing ? (trailingWidth ? `${trailingWidth}px` : adornmentSize) : undefined,
        } as CSSProperties
      }
    >
      {leading && (
        <InputAdornment className={"start-0 w-[var(--leading-width)]"} adornment={leading} pointer={leadingPointer} />
      )}
      <input
        ref={refs}
        className={clsx(
          "w-full resize-none appearance-none text-left align-middle outline-none",
          "bg-bg-normal rounded transition-colors",
          "disabled:bg-bg-subtlest disabled:cursor-not-allowed disabled:opacity-60",
          inputSizeStyles[size],
          leading && "ps-[var(--leading-width)]",
          trailing && "pe-[var(--trailing-width)]",
        )}
        size={htmlSize}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        onChange={handleChange}
        inputMode={inputMode}
        value={state}
        {...rest}
      />
      {trailing && (
        <InputAdornment className={"end-0 w-[var(--trailing-width)]"} adornment={trailing} pointer={trailingPointer} />
      )}
    </div>
  );
});

if (__DEV__) {
  Input.displayName = "Input";
}

const InputAdornment = ({
  adornment,
  pointer,
  className,
}: {
  adornment: ReactNode;
  pointer: boolean;
  className: string;
}) => {
  return (
    <span
      className={clsx(
        "text-fg-subtlest absolute inset-y-0 flex items-center justify-center",
        !pointer && "pointer-events-none",
        className,
      )}
    >
      {adornment}
    </span>
  );
};
