import type { PropsWithChildren } from "react";
import { ColorModeProvider } from "./ColorModeProvider";

export const ResolidProvider = ({ children }: PropsWithChildren) => {
  return <ColorModeProvider>{children}</ColorModeProvider>;
};
