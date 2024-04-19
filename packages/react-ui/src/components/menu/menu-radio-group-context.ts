import { createContext } from "../../utils/context";

export type MenuRadioGroupContext = {
  value?: string | number;
  onChange?: (value: string | number) => void;
};

export const [MenuRadioGroupProvider, useMenuRadioGroup] = createContext<MenuRadioGroupContext>({
  strict: true,
  name: "MenuRadioGroupContext",
});
