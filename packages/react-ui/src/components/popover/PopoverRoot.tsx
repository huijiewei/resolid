import {
  arrow,
  autoPlacement,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  type Placement,
} from "@floating-ui/react";
import { __DEV__, runIfFunction } from "@resolid/utils";
import type { ReactNode, RefObject } from "react";
import { useId, useMemo, useRef } from "react";
import { useDisclosure } from "../../hooks";
import { FloatingAriaProvider, type FloatingAriaContext } from "../floating/FloatingAriaContext";
import { FloatingArrowProvider, type FloatingArrowContext } from "../floating/FloatingArrowContext";
import { FloatingDispatchProvider } from "../floating/FloatingDispatchContext";
import { FloatingReferenceProvider, type FloatingReferenceContext } from "../floating/FloatingReferenceContext";
import { PopoverFloatingProvider, type PopoverContext } from "./PopoverContext";

export type PopoverProps = {
  /**
   * 控制打开状态
   */
  opened?: boolean;

  /**
   * 关闭时的回调
   */
  onClose?: () => void;

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

export const PopoverRoot = (props: PopoverProps) => {
  const {
    children,
    placement = "auto",
    closeOnEsc = true,
    closeOnBlur = true,
    modal = true,
    duration = 250,
    opened,
    onClose,
    initialFocus,
  } = props;

  const arrowRef = useRef<SVGSVGElement>(null);

  const { opened: openedState, open, close } = useDisclosure({ opened, onClose });

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

  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useRole(context),
    useDismiss(context, { escapeKey: closeOnEsc, outsidePress: closeOnBlur }),
  ]);

  const ariaContext = useMemo<FloatingAriaContext>(
    () => ({
      labelId,
      descriptionId,
    }),
    [descriptionId, labelId],
  );

  const referenceContext = useMemo<FloatingReferenceContext>(
    () => ({
      opened: openedState,
      setReference: refs.setReference,
      setPositionReference: refs.setPositionReference,
      getReferenceProps,
    }),
    [getReferenceProps, openedState, refs.setPositionReference, refs.setReference],
  );

  const floatingContext = useMemo<PopoverContext>(
    () => ({
      opened: openedState,
      duration,
      context,
      floatingStyles,
      setFloating: refs.setFloating,
      getFloatingProps,
      modal,
      initialFocus,
    }),
    [openedState, duration, context, floatingStyles, refs.setFloating, getFloatingProps, modal, initialFocus],
  );

  const arrowContext = useMemo<FloatingArrowContext>(
    () => ({
      context,
      setArrow: arrowRef,
      className: "fill-bg-normal [&>path:first-of-type]:stroke-bg-muted",
    }),
    [context],
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
