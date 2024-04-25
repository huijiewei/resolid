import type { Alignment } from "@floating-ui/react";
import type { MaybeFunction } from "@resolid/utils";
import type { ReactElement } from "react";
import { createContext } from "../../utils/context";

export type ToastId = string | number;

export type ToastPlacement = "top" | "bottom" | `top-${Alignment}` | `bottom-${Alignment}`;

type ToastBaseProps = {
  id: ToastId;
  duration: number | null;
  placement: ToastPlacement;
  update: boolean;
  dismiss: boolean;
};

export type ToastComponentContext = ToastBaseProps & {
  remove: () => void;
};

export const [ToastComponentProvider, useToastComponent] = createContext<ToastComponentContext>({
  strict: true,
  name: "ToastComponentContext",
});

export type ToastConfig = ToastBaseProps & {
  component: () => ReactElement;
};

export type ToastPromiseState = "pending" | "success" | "failure";

export type ToastPromiseComponentProps<T, E> = {
  state: ToastPromiseState;
  data?: T;
  error?: E;
};

export type ToastOptions = {
  id?: ToastId;

  /**
   * 自动关闭延时, 覆盖 `ResolidProvider` 提供的值
   */
  duration?: number | null;

  /**
   * 显示位置
   */
  placement?: ToastPlacement;
};

export type ToastActionsContext = {
  create: (component: ReactElement, options?: ToastOptions) => ToastId;
  update: (id: ToastId, component: ReactElement) => void;
  promise: <T = unknown, E extends Error = Error>(
    promise: MaybeFunction<Promise<T>>,
    component: (props: ToastPromiseComponentProps<T, E>) => ReactElement,
    options?: ToastOptions,
  ) => ToastId;
  dismiss: (id: ToastId) => void;
  clear: (...args: ToastPlacement[]) => void;
};

export const [ToastActionsProvider, useToast] = createContext<ToastActionsContext>({
  strict: true,
  name: "ToastActionsContext",
});
