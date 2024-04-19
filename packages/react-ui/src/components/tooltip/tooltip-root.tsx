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
  useFocus,
  useHover,
  useInteractions,
  useRole,
  type Placement,
} from "@floating-ui/react";
import { __DEV__, runIfFunction } from "@resolid/utils";
import { useMemo, useRef, type PropsWithChildren, type ReactNode } from "react";
import { useDisclosure } from "../../hooks";
import type { Color } from "../../utils/types";
import { FloatingArrowProvider, type FloatingArrowContext } from "../floating/floating-arrow-context";
import { FloatingReferenceProvider, type FloatingReferenceContext } from "../floating/floating-reference-context";
import { TooltipFloatingProvider, type TooltipContext } from "./tooltip-context";

export type TooltipRootProps = {
  /**
   * 触发模式
   * @default 'hover'
   */
  trigger?: "click" | "hover";

  /**
   * 颜色
   * @default 'neutral'
   */
  color?: Color;

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
  children?: ReactNode | ((props: { opened: boolean }) => ReactNode);
};

const tooltipColorStyles = {
  primary: {
    content: "border-bg-primary-emphasis-hovered bg-bg-primary-emphasis-hovered",
    arrow: "fill-bg-primary-emphasis-hovered [&>path:first-of-type]:stroke-bg-primary-emphasis-hovered",
  },
  neutral: {
    content: "border-bg-neutral-emphasis-hovered bg-bg-neutral-emphasis-hovered",
    arrow: "fill-bg-neutral-emphasis-hovered [&>path:first-of-type]:stroke-bg-neutral-emphasis-hovered",
  },
  success: {
    content: "border-bg-success-emphasis-hovered bg-bg-success-emphasis-hovered",
    arrow: "fill-bg-success-emphasis-hovered [&>path:first-of-type]:stroke-bg-success-emphasis-hovered",
  },
  warning: {
    content: "border-bg-warning-emphasis-hovered bg-bg-warning-emphasis-hovered",
    arrow: "fill-bg-warning-emphasis-hovered [&>path:first-of-type]:stroke-bg-warning-emphasis-hovered",
  },
  danger: {
    content: "border-bg-danger-emphasis-hovered bg-bg-danger-emphasis-hovered",
    arrow: "fill-bg-danger-emphasis-hovered [&>path:first-of-type]:stroke-bg-danger-emphasis-hovered",
  },
};

export const TooltipRoot = (props: PropsWithChildren<TooltipRootProps>) => {
  const { children, trigger = "hover", duration = 250, placement = "auto", color = "neutral" } = props;

  const [openedState, { open, close }] = useDisclosure({});

  const arrowRef = useRef<SVGSVGElement>(null);

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

  const colorStyle = tooltipColorStyles[color];

  const arrowContext = useMemo<FloatingArrowContext>(
    () => ({
      context,
      setArrow: arrowRef,
      className: colorStyle.arrow,
    }),
    [colorStyle.arrow, context],
  );

  const { getFloatingProps, getReferenceProps } = useInteractions([
    useHover(context, { enabled: trigger == "hover" }),
    useFocus(context, { enabled: trigger == "hover" }),
    useClick(context, { enabled: trigger == "click" }),
    useRole(context, { role: "tooltip" }),
    useDismiss(context),
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

  const floatingContext = useMemo<TooltipContext>(
    () => ({
      duration,
      context,
      floatingStyles,
      setFloating: refs.setFloating,
      getFloatingProps,
      floatingClass: colorStyle.content,
    }),
    [duration, context, floatingStyles, refs.setFloating, getFloatingProps, colorStyle.content],
  );

  return (
    <FloatingArrowProvider value={arrowContext}>
      <FloatingReferenceProvider value={referenceContext}>
        <TooltipFloatingProvider value={floatingContext}>
          {runIfFunction(children, { opened: openedState })}
        </TooltipFloatingProvider>
      </FloatingReferenceProvider>
    </FloatingArrowProvider>
  );
};

if (__DEV__) {
  TooltipRoot.displayName = "TooltipRoot";
}
