import { __DEV__ } from "@resolid/utils";
import { forwardRef, type MouseEvent } from "react";
import { useFloatingDispatch } from "../floating/FloatingDispatchContext";
import { useFloatingReference } from "../floating/FloatingReferenceContext";
import { Slot, type AsChildProps } from "../slot/Slot";

type ContextMenuTriggerProps = {
  disabled?: boolean;
};

export const ContextMenuTrigger = forwardRef<HTMLDivElement, AsChildProps<"div", ContextMenuTriggerProps>>(
  (props, ref) => {
    const { asChild, disabled = false, onContextMenu, children, ...rest } = props;

    const { setPositionReference, opened } = useFloatingReference();
    const { open } = useFloatingDispatch();

    const Comp = asChild ? Slot : "div";

    const handleOpen = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

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
        data-active={opened ? "" : undefined}
        onContextMenu={
          disabled
            ? onContextMenu
            : (e) => {
                handleOpen(e);
              }
        }
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
