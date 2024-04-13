import {
  FloatingNode,
  FloatingTree,
  arrow,
  autoUpdate,
  flip,
  offset,
  safePolygon,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useFocus,
  useHover,
  useInteractions,
  useListNavigation,
  useRole,
  type Placement,
} from "@floating-ui/react";
import { __DEV__, runIfFunction } from "@resolid/utils";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useAllowHover, useDisclosure } from "../../hooks";
import { FloatingArrowProvider, type FloatingArrowContext } from "../floating/floatingArrowContext";
import { FloatingDispatchProvider } from "../floating/floatingDispatchContext";
import { FloatingReferenceProvider } from "../floating/floatingReferenceContext";
import { MenuFloatingProvider, type MenuFloatingContext } from "./menuContext";

export type MenuProps = {
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
   * 按下 Esc 键时, 菜单将关闭
   * @default true
   */
  closeOnEsc?: boolean;

  /**
   * 单击外部时, 菜单将关闭
   * @default true
   */
  closeOnBlur?: boolean;

  /**
   * 选择项目后, 菜单将关闭
   * @default true
   */
  closeOnSelect?: boolean;

  /**
   * 放置位置
   * @default 'bottom-start'
   */
  placement?: Placement;

  /**
   * 动画持续时间
   * @default '250'
   */
  duration?: number;

  /**
   * 与触发元素的宽度同步
   * @default true
   */
  syncWidth?: boolean;

  /**
   * @ignore
   */
  lockScroll?: boolean;

  /**
   * @ignore
   */
  children?: ReactNode | ((props: { opened: boolean }) => ReactNode);
};

export const MenuRoot = (props: MenuProps) => {
  const parentId = useFloatingParentNodeId();

  if (parentId == null) {
    return (
      <FloatingTree>
        <MenuTree {...props} />
      </FloatingTree>
    );
  }

  return <MenuTree {...props} />;
};

if (__DEV__) {
  MenuRoot.displayName = "Menu";
}

const MenuTree = (props: MenuProps) => {
  const {
    syncWidth = true,
    trigger = "click",
    children,
    closeOnEsc = true,
    closeOnBlur = true,
    closeOnSelect = true,
    duration = 250,
    placement = "bottom-start",
    onClose,
    lockScroll = false,
  } = props;

  const tree = useFloatingTree();
  const nodeId = useFloatingNodeId();
  const parentId = useFloatingParentNodeId();
  const nested = parentId != null;

  const allowHover = useAllowHover();

  const { opened: openedState, open, close } = useDisclosure({ opened: undefined, onClose });

  const arrowRef = useRef<SVGSVGElement>(null);

  const { floatingStyles, refs, context } = useFloating({
    middleware: [
      offset({ mainAxis: nested ? 0 : 8, alignmentAxis: nested ? -5 : 0 }),
      flip(),
      shift({ padding: 8 }),
      arrow({
        element: arrowRef,
        padding: 4,
      }),
      syncWidth &&
        !nested &&
        size({
          apply({ rects, elements }) {
            Object.assign(elements.floating.style, {
              minWidth: `${rects.reference.width}px`,
            });
          },
        }),
    ].filter(Boolean),
    open: openedState,
    onOpenChange: (opened) => {
      opened ? open() : close();
    },
    nodeId,
    placement: nested ? "right-start" : placement,
    whileElementsMounted: autoUpdate,
  });

  const elementsRef = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    useHover(context, {
      enabled: trigger == "hover" || (nested && allowHover),
      handleClose: safePolygon(),
    }),
    useFocus(context, { enabled: trigger == "hover" && !nested }),
    useClick(context, { enabled: trigger == "click" && (!nested || !allowHover) }),
    useRole(context, { role: "menu" }),
    useDismiss(context, { escapeKey: closeOnEsc, outsidePress: closeOnBlur }),
    useListNavigation(context, {
      listRef: elementsRef,
      nested,
      activeIndex,
      onNavigate: setActiveIndex,
    }),
  ]);

  const referenceContext = useMemo(
    () => ({
      opened: openedState,
      setReference: refs.setReference,
      setPositionReference: refs.setPositionReference,
      getReferenceProps,
    }),
    [getReferenceProps, openedState, refs.setPositionReference, refs.setReference],
  );

  const floatingContext = useMemo<MenuFloatingContext>(
    () => ({
      nested,
      trigger,
      lockScroll,
      duration,
      tree,
      floatingStyles,
      context,
      setFloating: refs.setFloating,
      getFloatingProps,
      elementsRef,
      getItemProps,
      activeIndex,
    }),
    [
      nested,
      trigger,
      lockScroll,
      duration,
      tree,
      floatingStyles,
      context,
      refs.setFloating,
      getFloatingProps,
      getItemProps,
      activeIndex,
    ],
  );

  const arrowContext = useMemo<FloatingArrowContext>(
    () => ({
      context,
      setArrow: arrowRef,
      className: "fill-bg-normal [&>path:first-of-type]:stroke-bg-muted",
    }),
    [context],
  );

  useEffect(() => {
    const handleClick = () => {
      if (closeOnSelect) {
        close();
      }
    };

    tree?.events.on("click", handleClick);

    return () => {
      tree?.events.off("click", handleClick);
    };
  }, [tree, closeOnSelect, close]);

  return (
    <FloatingArrowProvider value={arrowContext}>
      <FloatingReferenceProvider value={referenceContext}>
        <MenuFloatingProvider value={floatingContext}>
          <FloatingDispatchProvider value={{ close, open }}>
            <FloatingNode id={nodeId}>{runIfFunction(children, { opened: openedState })}</FloatingNode>
          </FloatingDispatchProvider>
        </MenuFloatingProvider>
      </FloatingReferenceProvider>
    </FloatingArrowProvider>
  );
};
