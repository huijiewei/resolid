import { type ChangeEvent } from 'react';
import { createContext } from '../../utils/context';
import type { Color, Size } from '../../utils/types';

export type CheckboxBaseProps = {
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

export type CheckboxGroupBaseProps = CheckboxBaseProps & {
  /**
   * Checked value
   */
  value?: (string | number)[];
};

export type CheckboxGroupContext = CheckboxGroupBaseProps & {
  onChange: (event: ChangeEvent<HTMLInputElement> | string | number) => void;
  onReset: () => void;
};

const [CheckboxGroupProvider, useCheckboxGroup] = createContext<CheckboxGroupContext | undefined>({
  name: 'CheckboxGroupContext',
  strict: false,
});

export { CheckboxGroupProvider, useCheckboxGroup };
