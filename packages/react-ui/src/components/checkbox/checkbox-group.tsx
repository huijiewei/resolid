import { __DEV__ } from "@resolid/utils";
import type { PropsWithChildren } from "react";
import { type ChangeEvent, useCallback, useMemo } from "react";
import { useControllableState } from "../../hooks";
import { isInputEvent } from "../../utils/dom";
import { type CheckboxGroupBaseProps, CheckboxGroupProvider } from "./checkbox-group-context";

export type CheckboxGroupProps = CheckboxGroupBaseProps & {
  /**
   * 默认值
   */
  defaultValue?: (string | number)[];

  /**
   * onChange 回调
   */
  onChange?: (value: (string | number)[]) => void;
};

export const CheckboxGroup = (props: PropsWithChildren<CheckboxGroupProps>) => {
  const { value, defaultValue = [], onChange, children, size = "md", color = "primary", disabled = false } = props;

  const [state, setState] = useControllableState({
    value,
    defaultValue,
    onChange,
  });

  const handleChange = useCallback(
    (eventOrValue: ChangeEvent<HTMLInputElement> | string | number) => {
      if (!state) {
        return;
      }

      const inputEvent = isInputEvent(eventOrValue);

      const isChecked = inputEvent ? eventOrValue.target.checked : !state.includes(eventOrValue);

      const selectedValue = inputEvent ? eventOrValue.target.value : eventOrValue;

      const nextValue = isChecked
        ? [...state, selectedValue]
        : state.filter((v) => String(v) !== String(selectedValue));

      setState(nextValue);
    },
    [state, setState],
  );

  const handleReset = useCallback(() => {
    setState(defaultValue);
  }, [defaultValue, setState]);

  const group = useMemo(
    () => ({
      size,
      color,
      disabled,
      value: state,
      onChange: handleChange,
      onReset: handleReset,
    }),
    [size, color, disabled, state, handleChange, handleReset],
  );

  return <CheckboxGroupProvider value={group}>{children}</CheckboxGroupProvider>;
};

if (__DEV__) {
  CheckboxGroup.displayName = "CheckboxGroup";
}
