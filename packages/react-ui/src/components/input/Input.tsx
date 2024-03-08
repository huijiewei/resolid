import { __DEV__ } from "@resolid/utils";
import {
  forwardRef,
  useCallback,
  useRef,
  type CSSProperties,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useControllableState, useMergeRefs } from "../../hooks";
import { clsx } from "../../utils/classed";
import { CloseButton } from "../close-button/CloseButton";
import type { BaseProps } from "../slot/Slot";
import { inputAdornmentDefaultSizes, inputSizeStyles } from "./Input.styles";
import { useInputGroup, type InputGroupContext } from "./InputGroupContext";

export type InputProps = Partial<InputGroupContext> & {
  /**
   * 值
   */
  value?: string | number;

  /**
   * 默认值
   */
  defaultValue?: string | number;

  /**
   * 可清除内容
   * @default false
   */
  clearable?: boolean;

  /**
   * 禁用
   * @default false
   */
  disabled?: boolean;

  /**
   * 必须
   * @default false
   */
  required?: boolean;

  /**
   * 无效
   * @default false
   */
  invalid?: boolean;

  /**
   * 只读
   * @default false
   */
  readOnly?: boolean;

  /**
   * 全宽度
   * @default false
   */
  block?: boolean;

  /**
   * 值改变时触发回调
   */
  onChange?: (value: string | number) => void;

  /**
   * 点击清除按钮的回调
   */
  onClear?: () => void;

  /**
   * 按下回车键的回调
   */
  onPressEnter?: () => void;

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

export const Input = forwardRef<HTMLInputElement, BaseProps<"input", InputProps>>((props, ref) => {
  const group = useInputGroup();

  const {
    size = group?.size ?? "md",
    clearable = false,
    invalid = false,
    disabled = false,
    required = false,
    readOnly = false,
    block = false,
    className,
    value,
    defaultValue = "",
    onChange,
    onClear,
    onPressEnter,
    htmlSize,
    placeholder,
    leading,
    leadingWidth,
    leadingPointer = false,
    trailing,
    trailingWidth,
    trailingPointer = false,
    ...rest
  } = props;

  const [state, setState] = useControllableState({ value, defaultValue: defaultValue, onChange });

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (readOnly || disabled) {
        event.preventDefault();
        return;
      }

      setState(event.target.value);
    },
    [readOnly, disabled, setState],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.nativeEvent.isComposing) {
        return;
      }

      if (event.key == "Enter") {
        onPressEnter && onPressEnter();
      }
    },
    [onPressEnter],
  );

  const adornmentSize = inputAdornmentDefaultSizes[size];

  const inputRef = useRef<HTMLInputElement>(null);
  const refs = useMergeRefs(inputRef, ref);

  return (
    <div
      className={clsx("relative", block && "w-full", group && "group/input [&:not(:first-child)]:-ms-px")}
      style={
        {
          "--leading-width": leading ? (leadingWidth ? `${leadingWidth}px` : adornmentSize) : undefined,
          "--trailing-width": trailing ? (trailingWidth ? `${trailingWidth}px` : adornmentSize) : undefined,
          "--clear-button-width": clearable ? adornmentSize : undefined,
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
          "rounded border bg-bg-normal transition-colors",
          "disabled:cursor-not-allowed disabled:bg-bg-subtlest disabled:opacity-50",
          "focus:border-bg-primary-emphasis focus:ring-1 focus:ring-bg-primary-emphasis",
          inputSizeStyles[size],
          leading && "ps-[var(--leading-width)]",
          trailing && !clearable && "pe-[var(--trailing-width)]",
          clearable && !trailing && "pe-[var(--clear-button-width)]",
          clearable && trailing && "pe-[calc(var(--clear-button-width)*2/3+var(--trailing-width))]",
          invalid && "border-border-invalid",
          group &&
            "group-first/input:rounded-br-none group-first/input:rounded-tr-none group-last/input:rounded-bl-none group-last/input:rounded-tl-none group-[&:not(:first-child,:last-child)]/input:rounded-none",
          !disabled && !invalid && "hover:border-border-hovered",
          className,
        )}
        size={htmlSize}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={state}
        {...rest}
      />
      {clearable && state && (
        <span
          className={clsx(
            "absolute inset-y-0 flex items-center justify-center",
            trailing
              ? "end-[var(--trailing-width)] w-[calc(var(--clear-button-width)*2/3)]"
              : "end-0 w-[var(--clear-button-width)]",
          )}
        >
          <CloseButton
            tabIndex={0}
            size={"1rem"}
            disabled={disabled}
            onClick={(event) => {
              event.stopPropagation();
              setState("");
              onClear?.();
              inputRef.current?.focus();
            }}
            className={clsx("rounded-full bg-bg-subtlest p-0.5")}
          />
        </span>
      )}
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
        "absolute inset-y-0 flex items-center justify-center text-fg-subtlest",
        !pointer && "pointer-events-none",
        className,
      )}
    >
      {adornment}
    </span>
  );
};
