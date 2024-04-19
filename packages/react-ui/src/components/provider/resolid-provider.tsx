import type { PropsWithChildren } from "react";
import { ColorModeProvider } from "./color-mode-provider";

export const ResolidProvider = ({ children }: PropsWithChildren) => {
  return <ColorModeProvider>{children}</ColorModeProvider>;
};
