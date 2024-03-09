import type { FloatingTreeType, ReferenceElement } from "@floating-ui/react";
import type { HTMLProps, MutableRefObject } from "react";
import { createContext } from "../../utils/context";
import type { FloatingFloatingContext } from "../floating/FloatingFloatingContext";

export { MenuFloatingProvider, MenuSelectProvider, useMenuFloating, useMenuSelect };

export type MenuFloatingContext = MenuSelectContext &
  FloatingFloatingContext & {
    duration: number;
    nested: boolean;
    lockScroll: boolean;
    elementsRef: MutableRefObject<(HTMLElement | null)[]>;
  };

const [MenuFloatingProvider, useMenuFloating] = createContext<MenuFloatingContext>({
  strict: true,
  name: "MenuFloatingContext",
});

type MenuSelectContext = {
  tree: FloatingTreeType<ReferenceElement> | null;
  getItemProps: (userProps?: HTMLProps<HTMLElement> | undefined) => Record<string, unknown>;
  activeIndex: number | null;
};

const [MenuSelectProvider, useMenuSelect] = createContext<MenuSelectContext>({
  strict: true,
  name: "MenuSelectContext",
});
