import { createContext } from "../../utils/context";

export type DrawerPlacement = "left" | "right" | "bottom" | "top";

type DrawerContext = {
  placement: DrawerPlacement;
};

const [DrawerProvider, useDrawer] = createContext<DrawerContext>({
  strict: true,
  name: "DrawerContext",
});

export { DrawerProvider, useDrawer };
