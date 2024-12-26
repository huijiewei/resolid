import { runIfFunction } from "@resolid/utils";
import { type CSSProperties, type PropsWithChildren, type ReactElement, useMemo, useState } from "react";
import { clsx } from "../../utils/classed";
import { Portal } from "../portal/portal";
import {
  type ToastActionsContext,
  ToastActionsProvider,
  ToastComponentProvider,
  type ToastConfig,
  type ToastId,
  type ToastPlacement,
} from "./toast-context";

export type ToastProviderProps = {
  /**
   * 自动关闭延时, 设置为 `null` 时不自动关闭
   * @default 5000
   */
  duration?: number | null;

  /**
   * 放置位置
   * @default 'bottom'
   */
  placement?: ToastPlacement;

  /**
   * Toast 之间的间隔
   * @default '0.75rem'
   */
  spacing?: string;
};

type ToastState = {
  [K in ToastPlacement]: ToastConfig[];
};

export const ToastProvider = ({
  children,
  spacing = "0.75rem",
  duration = 5000,
  placement = "bottom",
}: PropsWithChildren<ToastProviderProps>) => {
  const [state, setState] = useState<ToastState>({
    "top-start": [],
    top: [],
    "top-end": [],
    "bottom-start": [],
    bottom: [],
    "bottom-end": [],
  });

  const context = useMemo<ToastActionsContext>(() => {
    const create: ToastActionsContext["create"] = (component, options) => {
      const toastId = options?.id ?? `t-${Math.random().toString(36).slice(2, 9)}`;
      const toastDuration = options?.duration === undefined ? duration : options.duration;
      const toastPlacement = options?.placement ?? placement;

      const toast = {
        id: toastId,
        duration: toastDuration,
        component: () => component,
        update: false,
        dismiss: false,
      };

      setState((prev) => {
        return {
          ...prev,
          [toastPlacement]:
            toastPlacement.slice(0, 3) == "top" ? [toast, ...prev[toastPlacement]] : [...prev[toastPlacement], toast],
        };
      });

      return toastId;
    };

    const updateImpl = (id: ToastId, component: ReactElement, duration?: number | null) => {
      setState((prev) => {
        const [placement, index] = getPlacementAndIndexById(prev, id);

        if (placement == undefined || index == undefined) {
          return prev;
        }

        return {
          ...prev,
          [placement]: [
            ...prev[placement].slice(0, index),
            {
              id,
              duration: duration !== undefined ? duration : prev[placement][index].duration,
              component: () => component,
              update: true,
              dismiss: false,
            },
            ...prev[placement].slice(index + 1),
          ],
        };
      });
    };

    const update: ToastActionsContext["update"] = (id, component) => {
      updateImpl(id, component);
    };

    const dismiss: ToastActionsContext["dismiss"] = (id) => {
      setState((prev) => {
        const [placement, index] = getPlacementAndIndexById(prev, id);

        if (placement == undefined || index == undefined) {
          return prev;
        }

        return {
          ...prev,
          [placement]: [
            ...prev[placement].slice(0, index),
            { ...prev[placement][index], dismiss: true },
            ...prev[placement].slice(index + 1),
          ],
        };
      });
    };

    const promise: ToastActionsContext["promise"] = (promise, component, options) => {
      const originalDuration = options?.duration === undefined ? duration : options.duration;

      const toastId = create(component({ state: "pending" }), { ...options, duration: null });

      runIfFunction(promise)
        .then((data) => {
          updateImpl(toastId, component({ state: "success", data }), originalDuration);
        })
        .catch((error) => {
          updateImpl(toastId, component({ state: "failure", error }), originalDuration);
        });

      return toastId;
    };

    const clear: ToastActionsContext["clear"] = (...args) => {
      const placements: ToastPlacement[] =
        args.length == 0 ? ["bottom", "bottom-start", "bottom-end", "top", "top-start", "top-end"] : args;

      setState((prev) => {
        const result = { ...prev };

        for (const placement of placements) {
          result[placement] = prev[placement].map((toast) => ({ ...toast, dismiss: true }));
        }

        return result;
      });
    };

    return {
      create,
      update,
      dismiss,
      promise,
      clear,
    };
  }, [duration, placement]);

  const remove = (id: ToastId) => {
    setState((prev) => {
      const [placement, index] = getPlacementAndIndexById(prev, id);

      if (placement == undefined || index == undefined) {
        return prev;
      }

      return {
        ...prev,
        [placement]: [...prev[placement].slice(0, index), ...prev[placement].slice(index + 1)],
      };
    });
  };

  return (
    <ToastActionsProvider value={context}>
      {children}
      <Portal>
        {Object.entries(state).map(([placement, toasts]) => {
          if (toasts.length == 0) {
            return null;
          }

          return (
            <div
              key={placement}
              role={"region"}
              aria-live="polite"
              style={{ "--spacing-var": spacing } as CSSProperties}
              className={clsx(
                "z-toast pointer-events-none fixed m-[--spacing-var] flex flex-col gap-[--spacing-var]",
                getToastListStyles(placement as ToastPlacement),
              )}
            >
              {toasts.map((toast) => {
                const ToastComp = toast.component;

                return (
                  <ToastComponentProvider
                    value={{
                      id: toast.id,
                      duration: toast.duration,
                      placement: placement as ToastPlacement,
                      dismiss: toast.dismiss,
                      update: toast.update,
                      remove: () => remove(toast.id),
                    }}
                    key={toast.id}
                  >
                    <ToastComp />
                  </ToastComponentProvider>
                );
              })}
            </div>
          );
        })}
      </Portal>
    </ToastActionsProvider>
  );
};

const getToastListStyles = (placement: ToastPlacement) => {
  const styles = [];

  if (placement.includes("top")) {
    styles.push("top-0");
  }

  if (placement.includes("bottom")) {
    styles.push("bottom-0");
  }

  if (!placement.includes("start")) {
    styles.push("right-0");
  }

  if (!placement.includes("end")) {
    styles.push("left-0");
  }

  return styles.join(" ");
};

const getPlacementAndIndexById = (state: ToastState, id: ToastId): [ToastPlacement | undefined, number | undefined] => {
  for (const [placement, toasts] of Object.entries(state)) {
    const index = toasts.findIndex((toast) => toast.id == id);

    if (index > -1) {
      return [placement as ToastPlacement, index];
    }
  }

  return [undefined, undefined];
};
