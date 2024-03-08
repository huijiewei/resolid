import { createContext } from "../../utils/context";
import type { Size } from "../../utils/types";

export type InputGroupContext = {
  /**
   * 大小
   * @default 'md'
   */
  size: Size;
};

const [InputGroupProvider, useInputGroup] = createContext<InputGroupContext | undefined>({
  strict: false,
  name: "InputGroupContext",
});

export { InputGroupProvider, useInputGroup };
