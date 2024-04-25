import { useCallback, useEffect, useMemo, useState } from "react";
import { useElementTransitionStatus, usePrevious, useTimeout } from "../../hooks";
import { clsx } from "../../utils/classed";
import { Alert, type AlertProps } from "../alert/alert";
import { FloatingAriaProvider, type FloatingAriaContext } from "../floating/floating-aria-context";
import { FloatingDispatchProvider } from "../floating/floating-dispatch-context";
import type { BaseProps } from "../slot/slot";
import { useToastComponent } from "./toast-context";

export type ToastRootProps = AlertProps & {
  /**
   * 控制 Toast 的优先权以实现可访问性。对于用户操作结果的请选择 `high`。从后台任务生成的应使用 `low`。
   * @default 'high'
   */
  priority?: "high" | "low";

  /**
   * onDismiss 回调
   */
  onDismiss?: () => void;
};

const placementTransformStyles = {
  top: {
    init: "",
    open: "",
    close: "-translate-y-2",
  },
  bottom: {
    init: "",
    open: "",
    close: "translate-y-2",
  },
};

export const ToastRoot = (props: BaseProps<"div", ToastRootProps, "role" | "id">) => {
  const { priority = "high", onDismiss, color = "primary", variant = "soft", children, className, ...rest } = props;

  const { id, duration, placement, dismiss, update, remove } = useToastComponent();

  const [openState, setOpenState] = useState(true);
  const [delayState, setDelayState] = useState(duration);
  const [transitionEnable, setTransitionEnable] = useState(!update);

  const { isMounted, status, setElement } = useElementTransitionStatus(openState, { duration: 250 });

  const handleDismiss = useCallback(() => {
    setTransitionEnable(true);
    setOpenState(false);
    onDismiss?.();
  }, [onDismiss]);

  useEffect(() => {
    if (dismiss) {
      handleDismiss();
    }
  }, [dismiss, handleDismiss]);

  const prevStatus = usePrevious(status);

  useEffect(() => {
    if (prevStatus == "close" && status == "unmounted") {
      remove();
    }
  }, [prevStatus, remove, status]);

  useTimeout(handleDismiss, delayState);

  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  const ariaContext = useMemo<FloatingAriaContext>(
    () => ({
      labelId,
      descriptionId,
    }),
    [descriptionId, labelId],
  );

  console.log(placement);

  const transformStyle = placementTransformStyles[placement?.split("-")[0] as keyof typeof placementTransformStyles];

  console.log(transformStyle);

  return (
    isMounted && (
      <div
        role="status"
        aria-live={priority == "high" ? "assertive" : "polite"}
        aria-atomic="true"
        ref={setElement}
        className={clsx(
          "flex flex-col items-center",
          "transition-[opacity,transform] duration-[250ms]",
          transitionEnable && status == "open" && `opacity-100 ${transformStyle.open}`,
          transitionEnable && status == "close" && `opacity-0 ${transformStyle.close}`,
          transitionEnable && status == "initial" && `opacity-0 ${transformStyle.init}`,
        )}
        onFocus={() => setDelayState(null)}
        onBlur={() => setDelayState(duration)}
        onMouseOver={() => setDelayState(null)}
        onMouseLeave={() => setDelayState(duration)}
        {...rest}
      >
        <Alert
          className={clsx("pointer-events-auto relative w-auto min-w-[20em] max-w-md pr-8 shadow-lg", className)}
          color={color}
          variant={variant}
          aria-labelledby={labelId}
          aria-describedby={descriptionId}
        >
          <FloatingAriaProvider value={ariaContext}>
            <FloatingDispatchProvider value={{ close: handleDismiss }}>{children}</FloatingDispatchProvider>
          </FloatingAriaProvider>
        </Alert>
      </div>
    )
  );
};
