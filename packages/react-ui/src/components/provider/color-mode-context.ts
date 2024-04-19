import type { Dispatch, SetStateAction } from "react";
import { createContext } from "../../utils/context";

export type ColorMode = "system" | "light" | "dark";

export const [ColorModeStateProvider, useColorModeState] = createContext<ColorMode>({
  name: "ColorModeStateContext",
  strict: true,
});

export const [ColorModeDispatchProvider, useColorModeDispatch] = createContext<Dispatch<SetStateAction<ColorMode>>>({
  name: "ColorModeDispatchContext",
  strict: true,
});
