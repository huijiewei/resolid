import type { PropsWithChildren } from "react";
import { ToastProvider, type ToastProviderProps } from "../toast/toast-provider";
import { ColorModeProvider } from "./color-mode-provider";

export type ResolidProviderProps = {
  toastOptions?: ToastProviderProps;
};

export const ResolidProvider = ({ children, toastOptions }: PropsWithChildren<ResolidProviderProps>) => {
  return (
    <ColorModeProvider>
      <ToastProvider {...toastOptions}>{children}</ToastProvider>
    </ColorModeProvider>
  );
};
