import { __DEV__ } from "@resolid/utils";
import { useCallback, useMemo, type ChangeEvent, type PropsWithChildren } from "react";
import { useControllableState } from "../../hooks";
import { isInputEvent } from "../../utils/dom";
import { RadioGroupProvider, type RadioGroupBaseProps } from "./RadioGroupContext";

type RadioGroupProps = RadioGroupBaseProps & {
  /**
   * Default value
   */
  defaultValue?: string | number;

  /**
   * onChange callback
   */
  onChange?: (value: string | number) => void;
};

export const RadioGroup = (props: PropsWithChildren<RadioGroupProps>) => {
  const { color, size, children, disabled, value, name, defaultValue = "", onChange } = props;

  const [state, setState] = useControllableState({
    value,
    defaultValue,
    onChange,
  });

  const handleChange = useCallback(
    (eventOrValue: ChangeEvent<HTMLInputElement> | string | number) => {
      const nextValue = isInputEvent(eventOrValue) ? eventOrValue.target.value : eventOrValue;

      setState(nextValue);
    },
    [setState],
  );

  const handleReset = useCallback(() => {
    setState(defaultValue);
  }, [defaultValue, setState]);

  const group = useMemo(
    () => ({
      name,
      size,
      color,
      disabled,
      value: state,
      onChange: handleChange,
      onReset: handleReset,
    }),
    [name, size, color, handleChange, handleReset, state, disabled],
  );

  return <RadioGroupProvider value={group}>{children}</RadioGroupProvider>;
};

if (__DEV__) {
  RadioGroup.displayName = "RadioGroup";
}
