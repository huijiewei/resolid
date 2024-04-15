import { createContext } from "../../utils/context";

const [MenuItemTriggerProvider, useMenuItemTrigger] = createContext<boolean | undefined>({
  strict: false,
  name: "MenuItemTriggerContext",
});

export { MenuItemTriggerProvider, useMenuItemTrigger };
