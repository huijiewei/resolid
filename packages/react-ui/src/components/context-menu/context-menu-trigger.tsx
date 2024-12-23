import { __DEV__ } from "@resolid/utils";
import { type MouseEvent, type PointerEventHandler, forwardRef, useCallback, useEffect, useRef } from "react";
import { composeEventHandlers, dataAttr } from "../../utils/dom";
import { useFloatingDispatch } from "../floating/floating-dispatch-context";
import { useFloatingReference } from "../floating/floating-reference-context";
import { type AsChildProps, Slot } from "../slot/slot";

type ContextMenuTriggerProps = {
  disabled?: boolean;
};

export const ContextMenuTrigger = forwardRef<HTMLDivElement, AsChildProps<"div", ContextMenuTriggerProps>>(
  (props, ref) => {
    const {
      asChild,
      disabled = false,
      onContextMenu,
      onPointerDown,
      onPointerMove,
      onPointerCancel,
      onPointerUp,
      children,
      ...rest
    } = props;

    const { setPositionReference, opened } = useFloatingReference();
    const { open } = useFloatingDispatch();

    const Comp = asChild ? Slot : "div";

    const longPressTimerRef = useRef(0);

    const clearLongPress = useCallback(() => window.clearTimeout(longPressTimerRef.current), []);

    useEffect(() => clearLongPress, [clearLongPress]);
    useEffect(() => void (disabled && clearLongPress()), [disabled, clearLongPress]);

    const handleOpen = (e: MouseEvent | PointerEvent) => {
      setPositionReference({
        getBoundingClientRect() {
          return {
            height: 0,
            width: 0,
            x: e.clientX,
            y: e.clientY,
            top: e.clientY,
            right: e.clientX,
            bottom: e.clientY,
            left: e.clientX,
          };
        },
      });

      open?.();
    };

    return (
      <Comp
        ref={ref}
        data-active={dataAttr(opened)}
        onContextMenu={
          disabled
            ? onContextMenu
            : // eslint-disable-next-line react-compiler/react-compiler
              composeEventHandlers(onContextMenu, (e) => {
                clearLongPress();
                handleOpen(e);
                e.preventDefault();
              })
        }
        onPointerDown={
          disabled
            ? onPointerDown
            : composeEventHandlers(
                onPointerDown,
                /* eslint-disable-next-line react-compiler/react-compiler */
                whenTouchOrPen((e) => {
                  clearLongPress();
                  longPressTimerRef.current = window.setTimeout(() => handleOpen(e), 700);
                }),
              )
        }
        /* eslint-disable-next-line react-compiler/react-compiler */
        onPointerMove={disabled ? onPointerMove : composeEventHandlers(onPointerMove, whenTouchOrPen(clearLongPress))}
        onPointerCancel={
          /* eslint-disable-next-line react-compiler/react-compiler */
          disabled ? onPointerCancel : composeEventHandlers(onPointerCancel, whenTouchOrPen(clearLongPress))
        }
        /* eslint-disable-next-line react-compiler/react-compiler */
        onPointerUp={disabled ? onPointerUp : composeEventHandlers(onPointerUp, whenTouchOrPen(clearLongPress))}
        {...rest}
      >
        {children}
      </Comp>
    );
  },
);

if (__DEV__) {
  ContextMenuTrigger.displayName = "ContextMenuTrigger";
}

const whenTouchOrPen =
  <E extends Element>(handler: PointerEventHandler<E>): PointerEventHandler<E> =>
  (event) =>
    event.pointerType != "mouse" ? handler(event) : undefined;
