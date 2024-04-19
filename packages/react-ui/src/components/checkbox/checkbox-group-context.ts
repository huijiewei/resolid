import type { ChangeEvent } from "react";
import { createContext } from "../../utils/context";
import type { Color, Size } from "../../utils/types";

export type CheckboxBaseProps = {
  /**
   * 大小
   * @default 'md'
   */
  size?: Size;

  /**
   * 颜色
   * @default 'primary'
   */
  color?: Color;

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
};

export type CheckboxGroupBaseProps = CheckboxBaseProps & {
  /**
   * 选中的值
   */
  value?: (string | number)[];
};

export type CheckboxGroupContext = CheckboxGroupBaseProps & {
  onChange: (event: ChangeEvent<HTMLInputElement> | string | number) => void;
  onReset: () => void;
};

export const [CheckboxGroupProvider, useCheckboxGroup] = createContext<CheckboxGroupContext | undefined>({
  name: "CheckboxGroupContext",
  strict: false,
});
