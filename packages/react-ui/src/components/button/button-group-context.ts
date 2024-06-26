import { createContext } from "../../utils/context";
import type { ButtonStyleProps } from "./button.styles";

export type ButtonBaseProps = {
  /**
   * 大小
   * @default 'md'
   */
  size?: ButtonStyleProps["size"];

  /**
   * 颜色
   * @default 'primary'
   */
  color?: ButtonStyleProps["color"];

  /**
   * 外观
   * @default 'solid'
   */
  variant?: ButtonStyleProps["variant"];
};

export type ButtonGroupContext = ButtonBaseProps & {
  /**
   * 是否垂直
   * @default false
   */
  vertical?: boolean;
};

export const [ButtonGroupProvider, useButtonGroup] = createContext<ButtonGroupContext>({
  strict: false,
  name: "ButtonGroupContext",
});
