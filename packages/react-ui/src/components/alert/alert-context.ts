import { createContext } from "../../utils/context";
import type { AlertStyleProps } from "./alert.styles";

export type AlertContext = {
  /**
   * 外观
   * @default 'soft'
   */
  variant?: AlertStyleProps["variant"];

  /**
   * 颜色
   * @default 'primary'
   */
  color?: AlertStyleProps["color"];
};

export const [AlertProvider, useAlert] = createContext<Required<AlertContext>>({
  strict: true,
  name: "AlertContext",
});
