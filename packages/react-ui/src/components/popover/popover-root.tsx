import {
  arrow,
  autoPlacement,
  autoUpdate,
  flip,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStatus,
  type Placement,
} from "@floating-ui/react";
import { __DEV__, runIfFunction } from "@resolid/utils";
import { useEffect, useId, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { useDisclosure, usePrevious } from "../../hooks";
import { FloatingAriaProvider, type FloatingAriaContext } from "../floating/floating-aria-context";
import { FloatingArrowProvider, type FloatingArrowContext } from "../floating/floating-arrow-context";
import { FloatingDispatchProvider } from "../floating/floating-dispatch-context";
import { FloatingReferenceProvider, type FloatingReferenceContext } from "../floating/floating-reference-context";
import { PopoverFloatingProvider, type PopoverContext } from "./popover-context";

export type PopoverRootProps = {
  /**
   * 触发模式
   * @default 'click'
   */
  trigger?: "click" | "hover";

  /**
   * 关闭时的回调
   */
  onClose?: () => void;

  /**
   * 关闭完成后的回调
   */
  onCloseComplete?: () => void;

  /**
   * 开启后焦点目标
   */
  initialFocus?: number | RefObject<HTMLElement>;

  /**
   * 是否 Modal
   * @default true
   */
  modal?: boolean;

  /**
   * 按下 Esc 键时, 弹出框将关闭
   * @default true
   */
  closeOnEsc?: boolean;

  /**
   * 单击外部时, 弹出框将关闭
   * @default true
   */
  closeOnBlur?: boolean;

  /**
   * 放置位置
   * @default 'auto'
   */
  placement?: "auto" | Placement;

  /**
   * 动画持续时间
   * @default '250'
   */
  duration?: number;

  /**
   * @ignore
   */
  children?: ReactNode | ((props: { opened: boolean; close: () => void }) => ReactNode);
};

export const PopoverRoot = (props: PopoverRootProps) => {
  const {
    children,
    trigger = "click",
    placement = "auto",
    closeOnEsc = true,
    closeOnBlur = true,
    modal = true,
    duration = 250,
    onClose,
    onCloseComplete,
    initialFocus,
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

  const arrowRef = useRef<SVGSVGElement>(null);

  const [openedState, { open, close }] = useDisclosure({ onClose });

  const { floatingStyles, refs, context } = useFloating({
    middleware: [
      offset(8),
      placement == "auto" ? autoPlacement() : flip(),
      shift({ padding: 8 }),
      arrow({
        element: arrowRef,
        padding: 4,
      }),
    ],
    open: openedState,
    onOpenChange: (opened) => {
      opened ? open() : close();
    },
    placement: placement == "auto" ? undefined : placement,
    whileElementsMounted: autoUpdate,
  });

  const arrowContext = useMemo<FloatingArrowContext>(
    () => ({
      context,
      setArrow: arrowRef,
      className: "fill-bg-normal [&>path:first-of-type]:stroke-bg-muted",
    }),
    [context],
  );

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, {
      enabled: trigger == "hover",
      move: false,
      handleClose: safePolygon({ blockPointerEvents: true }),
    }),
    useFocus(context, { enabled: trigger == "hover" }),
    useClick(context, {
      event: "mousedown",
      ignoreMouse: trigger == "hover",
    }),
    useRole(context),
    useDismiss(context, { escapeKey: closeOnEsc, outsidePress: closeOnBlur }),
  ]);

  const referenceContext = useMemo<FloatingReferenceContext>(
    () => ({
      opened: openedState,
      setReference: refs.setReference,
      setPositionReference: refs.setPositionReference,
      getReferenceProps,
    }),
    [getReferenceProps, openedState, refs.setPositionReference, refs.setReference],
  );

  const { isMounted, status } = useTransitionStatus(context, {
    duration: duration,
  });

  const prevStatus = usePrevious(status);

  useEffect(() => {
    if (prevStatus == "close" && status == "unmounted") {
      onCloseComplete && onCloseComplete();
    }
  }, [onCloseComplete, prevStatus, status]);

  const floatingContext = useMemo<PopoverContext>(
    () => ({
      mounted: isMounted,
      status,
      duration,
      context,
      floatingStyles,
      setFloating: refs.setFloating,
      getFloatingProps,
      modal,
      initialFocus,
      trigger,
    }),
    [
      isMounted,
      status,
      duration,
      context,
      floatingStyles,
      refs.setFloating,
      getFloatingProps,
      modal,
      initialFocus,
      trigger,
    ],
  );

  return (
    <FloatingAriaProvider value={ariaContext}>
      <FloatingArrowProvider value={arrowContext}>
        <FloatingDispatchProvider value={{ close }}>
          <FloatingReferenceProvider value={referenceContext}>
            <PopoverFloatingProvider value={floatingContext}>
              {runIfFunction(children, { opened: openedState, close })}
            </PopoverFloatingProvider>
          </FloatingReferenceProvider>
        </FloatingDispatchProvider>
      </FloatingArrowProvider>
    </FloatingAriaProvider>
  );
};

if (__DEV__) {
  PopoverRoot.displayName = "PopoverRoot";
}
