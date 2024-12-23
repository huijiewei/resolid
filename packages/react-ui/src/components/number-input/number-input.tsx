import { __DEV__, clamp, isNumber } from "@resolid/utils";
import { type FocusEvent, forwardRef, type KeyboardEvent, useCallback, useRef, useState } from "react";
import { useControllableState, useEventListener, useMergeRefs } from "../../hooks";
import { Input, type InputProps } from "../input/input";
import type { BaseProps } from "../slot/slot";
import { NumberInputControl } from "./number-input-control";

export type NumberInputProps = Omit<InputProps, "trailing" | "trailingWidth" | "trailingPointer" | "onChange"> & {
  /**
   * 可控值
   */
  value?: number;

  /**
   * 默认值
   */
  defaultValue?: number;

  /**
   * onChange 回调
   */
  onChange?: (value: number | undefined) => void;

  /**
   * 步进
   * @default 1
   */
  step?: number;

  /**
   * 最小值
   * @default -Infinity
   */
  min?: number;

  /**
   * 最大值
   * @default Infinity
   */
  max?: number;

  /**
   * 小数精度
   * @default 0
   */
  precision?: number;

  /**
   * 自定义显示格式
   */
  format?: (value: string) => string;

  /**
   * 如果使用自定义显示格式，转换为 parseFloat 可以处理的格式
   */
  parse?: (value: string) => string;

  /**
   * 滚轮改变
   * @default false
   */
  mouseWheel?: boolean;
};

export const NumberInput = forwardRef<
  HTMLInputElement,
  BaseProps<"input", NumberInputProps, "type" | "inputMode" | "role">
>((props, ref) => {
  const {
    value,
    defaultValue,
    onChange,
    min,
    max,
    step = 1,
    precision,
    mouseWheel,
    format = (value) => value,
    parse = (value) => value,
    disabled = false,
    readOnly = false,
    size = "md",
    onBlur,
    onFocus,
    ...rest
  } = props;

  const minValue = isNumber(min) ? min : Number.NEGATIVE_INFINITY;
  const maxValue = isNumber(max) ? max : Number.POSITIVE_INFINITY;
  const stepValue = Number.parseFloat(step.toString());
  const precisionValue = precision ?? step.toString().split(".")[1]?.length ?? 0;

  const [state, setState] = useControllableState<number | undefined>({
    value,
    defaultValue: defaultValue,
    onChange,
  });

  const [inputValue, setInputValue] = useState(isNumber(state) ? state.toFixed(precisionValue) : "");

  const formattedValue = format(inputValue);

  const update = useCallback(
    (next: number | undefined) => {
      if (next == state) {
        return;
      }

      setState(next);
    },
    [state, setState],
  );

  const handleChange = useCallback(
    (value: string | number) => {
      const parsed = parse(value.toString());

      setInputValue(parsed);

      if (value == "" || value == "-") {
        update(undefined);
      } else {
        const number = Number.parseFloat(parsed);

        if (!Number.isNaN(number)) {
          update(number);
        }
      }
    },
    [parse, update],
  );

  const increment = useCallback(
    (incrementStep = stepValue) => {
      if (state == undefined) {
        update(min || 0);
        setInputValue(min != undefined ? min.toFixed(precisionValue) : "0");
      } else {
        const value = clamp(state + incrementStep, [minValue, maxValue]).toFixed(precisionValue);

        update(Number.parseFloat(value));
        setInputValue(value);
      }
    },
    [maxValue, min, minValue, precisionValue, stepValue, state, update],
  );

  const decrement = useCallback(
    (decrementStep = stepValue) => {
      if (state == undefined) {
        update(min || 0);
        setInputValue(min != undefined ? min.toFixed(precisionValue) : "0");
      } else {
        const value = clamp(state - decrementStep, [minValue, maxValue]).toFixed(precisionValue);

        update(Number.parseFloat(value));
        setInputValue(value);
      }
    },
    [maxValue, min, minValue, precisionValue, stepValue, state, update],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.nativeEvent.isComposing) {
        return;
      }

      if (
        event.key != null &&
        event.key.length == 1 &&
        !(event.ctrlKey || event.altKey || event.metaKey) &&
        !/^[Ee0-9+\-.]$/.test(event.key)
      ) {
        event.preventDefault();
      }

      if (event.key == "ArrowUp") {
        event.preventDefault();
        increment((event.metaKey || event.ctrlKey ? 0.1 : event.shiftKey ? 10 : 1) * stepValue);
      }

      if (event.key == "ArrowDown") {
        event.preventDefault();
        decrement((event.metaKey || event.ctrlKey ? 0.1 : event.shiftKey ? 10 : 1) * stepValue);
      }

      if (event.key == "Home") {
        event.preventDefault();
        update(min);
      }

      if (event.key == "End") {
        event.preventDefault();
        update(max);
      }
    },
    [decrement, increment, max, min, stepValue, update],
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const [focusState, setFocusState] = useState(false);

  useEventListener(
    "wheel",
    (event) => {
      if (!mouseWheel || !focusState || readOnly) {
        return;
      }

      event.preventDefault();

      const direction = Math.sign(event.deltaY);

      if (direction == -1) {
        increment();
      } else if (direction == 1) {
        decrement();
      }
    },
    inputRef,
    { passive: false },
  );

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      setFocusState(true);
      onFocus?.(event);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      if (event.target.value === "") {
        setInputValue("");
        update(undefined);
      } else {
        const parsed = parse(event.target.value[0] == "." ? `0${event.target.value}` : event.target.value);
        const value = clamp(Number.parseFloat(parsed), [minValue, maxValue]);

        if (!Number.isNaN(value)) {
          setInputValue(value.toFixed(precisionValue));
          update(Number.parseFloat(value.toFixed(precisionValue)));
        } else {
          setInputValue(state != undefined ? state.toFixed(precisionValue) : "");
        }
      }

      setFocusState(false);
      onBlur?.(event);
    },
    [maxValue, minValue, precisionValue, onBlur, parse, state, update],
  );

  const refs = useMergeRefs(ref, inputRef);

  return (
    <Input
      ref={refs}
      type={"text"}
      inputMode={"decimal"}
      role={"spinbutton"}
      aria-valuemin={min}
      aria-valuemax={max}
      autoComplete={"off"}
      autoCorrect={"off"}
      spellCheck={false}
      aria-valuenow={state}
      aria-valuetext={formattedValue != "" ? formattedValue : undefined}
      disabled={disabled}
      readOnly={readOnly}
      value={formattedValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      size={size}
      trailingPointer={true}
      trailing={
        <span className={"flex h-full w-[calc(var(--trailing-width)-2px)] flex-col gap-px py-px ps-2"}>
          <NumberInputControl
            stepper={"increment"}
            onClick={(event) => {
              event.stopPropagation();
              increment();
              inputRef.current?.focus();
            }}
            disabled={disabled || readOnly || (state ?? 0) >= maxValue}
          />
          <NumberInputControl
            stepper={"decrement"}
            onClick={(event) => {
              event.stopPropagation();
              decrement();
              inputRef.current?.focus();
            }}
            disabled={disabled || readOnly || (state ?? 0) <= minValue}
          />
        </span>
      }
      {...rest}
    />
  );
});

if (__DEV__) {
  NumberInput.displayName = "NumberInput";
}
