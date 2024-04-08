import type { Dispatch, SetStateAction } from "react";
import { createContext } from "../../utils/context";

export type ColorMode = "system" | "light" | "dark";

const [ColorModeStateProvider, useColorModeState] = createContext<ColorMode>({
  name: "ColorModeStateContext",
  strict: true,
});

const [ColorModeDispatchProvider, useColorModeDispatch] = createContext<Dispatch<SetStateAction<ColorMode>>>({
  name: "ColorModeDispatchContext",
  strict: true,
});

export { ColorModeDispatchProvider, ColorModeStateProvider, useColorModeDispatch, useColorModeState };
