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
  useHover,
  useInteractions,
  useListNavigation,
  useRole,
  type Placement,
} from "@floating-ui/react";
import { __DEV__ } from "@resolid/utils";
import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { useAllowHover, useDisclosure } from "../../hooks";
import { FloatingArrowProvider, type FloatingArrowContext } from "../floating/floatingArrowContext";
import { FloatingDispatchProvider } from "../floating/floatingDispatchContext";
import { FloatingReferenceProvider } from "../floating/floatingReferenceContext";
import { MenuFloatingProvider, type MenuFloatingContext } from "./menuContext";

export type MenuProps = {
  /**
   * 控制打开状态
   */
  opened?: boolean;

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

  /* @ignore */
  lockScroll?: boolean;

  /* @ignore */
  children?: ReactElement[];
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
    children,
    closeOnEsc = true,
    closeOnBlur = true,
    closeOnSelect = true,
    opened,
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

  const { opened: openedState, open, close } = useDisclosure({ opened, onClose });

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
      enabled: nested && allowHover,
      handleClose: safePolygon(),
    }),
    useClick(context, { toggle: !nested || !allowHover, event: "mousedown", ignoreMouse: nested }),
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
            <FloatingNode id={nodeId}>{children}</FloatingNode>
          </FloatingDispatchProvider>
        </MenuFloatingProvider>
      </FloatingReferenceProvider>
    </FloatingArrowProvider>
  );
};
