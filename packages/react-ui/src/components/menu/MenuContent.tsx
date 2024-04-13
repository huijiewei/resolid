import { FloatingFocusManager, FloatingList, useTransitionStatus } from "@floating-ui/react";
import { __DEV__ } from "@resolid/utils";
import type { CSSProperties } from "react";
import { RemoveScrollBar } from "react-remove-scroll-bar";
import { clsx } from "../../utils/classed";
import { Portal } from "../portal/Portal";
import type { BaseProps } from "../slot/Slot";
import { MenuSelectProvider, useMenuFloating } from "./menuContext";

export const MenuContent = (props: BaseProps<"div">) => {
  const { children, className, ...rest } = props;

  const {
    nested,
    trigger,
    lockScroll,
    tree,
    duration,
    floatingStyles,
    context,
    setFloating,
    getFloatingProps,
    elementsRef,
    getItemProps,
    activeIndex,
  } = useMenuFloating();

  const { isMounted, status } = useTransitionStatus(context, {
    duration: duration,
  });

  const menuInner = (
    <div
      className={clsx(
        "z-popup rounded border border-bd-normal bg-bg-normal p-1 shadow outline-none",
        "transition-opacity duration-[--duration-var]",
        status == "open" ? "opacity-100" : "opacity-0",
        className,
      )}
      ref={setFloating}
      style={{ ...floatingStyles, "--duration-var": `${duration}ms` } as CSSProperties}
      {...getFloatingProps({
        ...rest,
      })}
    >
      <MenuSelectProvider value={{ getItemProps, activeIndex, tree }}>
        <FloatingList elementsRef={elementsRef}>{children}</FloatingList>
      </MenuSelectProvider>
    </div>
  );

  return (
    <>
      {isMounted && (
        <Portal>
          {!nested && lockScroll && <RemoveScrollBar />}
          {!nested && trigger == "click" ? (
            <FloatingFocusManager modal={false} initialFocus={0} returnFocus={true} context={context}>
              {menuInner}
            </FloatingFocusManager>
          ) : (
            menuInner
          )}
        </Portal>
      )}
    </>
  );
};

if (__DEV__) {
  MenuContent.displayName = "MenuContent";
}
