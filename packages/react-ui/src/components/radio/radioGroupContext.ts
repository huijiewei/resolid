import type { ChangeEvent } from "react";
import { createContext } from "../../utils/context";
import type { Color, Size } from "../../utils/types";

export type RadioBaseProps = {
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

export type RadioGroupBaseProps = RadioBaseProps & {
  /**
   * 单选中输入字段的名称
   */
  name?: string;

  /**
   * 值
   */
  value?: string | number;
};

export type RadioGroupContext = RadioGroupBaseProps & {
  onChange: (event: ChangeEvent<HTMLInputElement> | string | number) => void;
  onReset: () => void;
};

const [RadioGroupProvider, useRadioGroup] = createContext<RadioGroupContext | undefined>({
  name: "RadioGroupContext",
  strict: false,
});

export { RadioGroupProvider, useRadioGroup };
