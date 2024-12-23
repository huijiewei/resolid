import {
  arrow,
  autoUpdate,
  flip,
  FloatingNode,
  FloatingTree,
  offset,
  type Placement,
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
} from "@floating-ui/react";
import { __DEV__, runIfFunction } from "@resolid/utils";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useDisclosure } from "../../hooks";
import { type FloatingArrowContext, FloatingArrowProvider } from "../floating/floating-arrow-context";
import { FloatingDispatchProvider } from "../floating/floating-dispatch-context";
import { FloatingReferenceProvider } from "../floating/floating-reference-context";
import { type MenuFloatingContext, MenuFloatingProvider } from "./menu-context";

export type MenuRootProps = {
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

export const MenuRoot = (props: MenuRootProps) => {
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

const MenuTree = (props: MenuRootProps) => {
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

  const [openedState, { open, close }] = useDisclosure({ onClose });

  const arrowRef = useRef<SVGSVGElement>(null);

  const { floatingStyles, refs, context } = useFloating({
    middleware: [
      offset({ mainAxis: nested ? 0 : 8, alignmentAxis: nested ? -5 : 0 }),
      flip(),
      shift({ padding: 8 }),
      // eslint-disable-next-line react-compiler/react-compiler
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
      if (opened) {
        open();
      } else {
        close();
      }
    },
    nodeId,
    placement: nested ? "right-start" : placement,
    whileElementsMounted: autoUpdate,
  });

  const elementsRef = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const enableHover = trigger == "hover" || nested;

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    useHover(context, {
      enabled: enableHover,
      move: false,
      handleClose: safePolygon({ blockPointerEvents: true }),
    }),
    useFocus(context, { enabled: trigger == "hover" && !nested }),
    useClick(context, {
      toggle: !nested,
      event: "mousedown",
      ignoreMouse: enableHover,
    }),
    useRole(context, { role: "menu" }),
    useDismiss(context, { escapeKey: closeOnEsc, outsidePress: closeOnBlur, bubbles: true }),
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
    if (!tree) {
      return;
    }

    const handleTreeClick = () => {
      if (closeOnSelect) {
        close();
      }
    };

    const handleSubMenuOpen = (event: { nodeId: string; parentId: string }) => {
      if (event.nodeId != nodeId && event.parentId == parentId) {
        if (closeOnSelect) {
          close();
        }
      }
    };

    tree.events.on("click", handleTreeClick);
    tree.events.on("menuopen", handleSubMenuOpen);

    return () => {
      tree.events.off("click", handleTreeClick);
      tree.events.off("menuopen", handleSubMenuOpen);
    };
  }, [tree, closeOnSelect, close, nodeId, parentId]);

  useEffect(() => {
    if (openedState && tree) {
      tree.events.emit("menuopen", { parentId, nodeId });
    }
  }, [tree, nodeId, parentId, openedState]);

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
