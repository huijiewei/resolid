import type { PropsWithChildren } from "react";
import { ColorModeProvider } from "./ColorModeProvider";

export { useColorModeDispatch, useColorModeState, type ColorMode } from "./ColorModeContext";
export { ColorModeScript } from "./ColorModeScript";

export const ResolidProvider = ({ children }: PropsWithChildren) => {
  return <ColorModeProvider>{children}</ColorModeProvider>;
};
