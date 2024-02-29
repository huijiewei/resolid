import { type ChangeEvent } from 'react';
import { createContext } from '../../utils/context';
import type { Color, Size } from '../../utils/types';

export type RadioBaseProps = {
  /**
   * Size
   * @default 'md'
   */
  size?: Size;

  /**
   * Color
   * @default 'primary'
   */
  color?: Color;

  /**
   * Disabled
   * @default false
   */
  disabled?: boolean;
};

export type RadioGroupBaseProps = RadioBaseProps & {
  /**
   * The name of the input field in a radio
   */
  name?: string;

  /**
   * Value
   */
  value?: string | number;
};

export type RadioGroupContext = RadioGroupBaseProps & {
  onChange: (event: ChangeEvent<HTMLInputElement> | string | number) => void;
  onReset: () => void;
};

const [RadioGroupProvider, useRadioGroup] = createContext<RadioGroupContext | undefined>({
  name: 'RadioGroupContext',
  strict: false,
});

export { RadioGroupProvider, useRadioGroup };
