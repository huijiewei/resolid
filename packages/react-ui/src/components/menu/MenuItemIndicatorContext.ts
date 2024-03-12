import { createContext } from "../../utils/context";

export type CheckedState = boolean | "indeterminate";

type MenuItemIndicatorContext = {
  checked: CheckedState;
};

const [MenuItemIndicatorProvider, useMenuItemIndicator] = createContext<MenuItemIndicatorContext>({
  strict: true,
  name: "MenuItemIndicatorContext",
});

export { MenuItemIndicatorProvider, useMenuItemIndicator };
