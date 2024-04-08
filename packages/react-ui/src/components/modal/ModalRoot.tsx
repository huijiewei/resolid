import { useClick, useDismiss, useFloating, useInteractions, useRole, useTransitionStatus } from "@floating-ui/react";
import { __DEV__ } from "@resolid/utils";
import { useEffect, useId, useMemo, type PropsWithChildren } from "react";
import { usePrevious } from "../../hooks";
import { FloatingAriaProvider, type FloatingAriaContext } from "../floating/floatingAriaContext";
import { FloatingDispatchProvider } from "../floating/floatingDispatchContext";
import { Portal } from "../portal/Portal";
import { ModalProvider, type ModalBaseProps, type ModalContext } from "./modalContext";

export type ModalProps = ModalBaseProps & {
  /**
   * 关闭时的回调
   */
  onClose: () => void;

  /**
   * 关闭完成后的回调
   */
  onCloseComplete?: () => void;

  /**
   * 按下 Esc 键时, 将关闭
   * @default true
   */
  closeOnEsc?: boolean;

  /**
   * 单击外部时, 将关闭
   * @default true
   */
  closeOnBlur?: boolean;

  /**
   * 动画持续时间
   * @default '250'
   */
  duration?: number;
};

export const ModalRoot = (props: PropsWithChildren<ModalProps>) => {
  const {
    children,
    closeOnEsc = true,
    closeOnBlur = true,
    opened,
    centered,
    duration = 250,
    onClose,
    onCloseComplete,
    lockScroll = true,
    initialFocus,
    finalFocus,
    scrollBehavior = "outside",
  } = props;

  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  const ariaContext = useMemo<FloatingAriaContext>(
    () => ({
      labelId,
      descriptionId,
    }),
    [descriptionId, labelId],
  );

  const { refs, context } = useFloating<HTMLElement>({
    open: opened,
    onOpenChange: (opened) => {
      if (!opened) {
        onClose();
      }
    },
  });

  const { getFloatingProps } = useInteractions([
    useClick(context),
    useRole(context),
    useDismiss(context, { escapeKey: closeOnEsc, outsidePress: closeOnBlur }),
  ]);

  const { isMounted, status } = useTransitionStatus(context, {
    duration: duration,
  });

  const modalContext = useMemo<ModalContext>(
    () => ({
      opened,
      centered,
      status,
      duration,
      context,
      setFloating: refs.setFloating,
      getFloatingProps,
      initialFocus,
      finalFocus,
      scrollBehavior,
      lockScroll,
    }),
    [
      opened,
      centered,
      status,
      duration,
      context,
      refs.setFloating,
      getFloatingProps,
      initialFocus,
      finalFocus,
      scrollBehavior,
      lockScroll,
    ],
  );

  const prevStatus = usePrevious(status);

  useEffect(() => {
    if (prevStatus == "close" && status == "unmounted") {
      onCloseComplete && onCloseComplete();
    }
  }, [onCloseComplete, prevStatus, status]);

  return (
    <ModalProvider value={modalContext}>
      <FloatingAriaProvider value={ariaContext}>
        <FloatingDispatchProvider value={{ close: onClose }}>
          {isMounted && <Portal>{children}</Portal>}
        </FloatingDispatchProvider>
      </FloatingAriaProvider>
    </ModalProvider>
  );
};

if (__DEV__) {
  ModalRoot.displayName = "Modal";
}
