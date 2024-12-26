import { FloatingFocusManager, FloatingList, useTransitionStatus } from "@floating-ui/react";
import { __DEV__ } from "@resolid/utils";
import type { CSSProperties } from "react";
import { RemoveScrollBar } from "react-remove-scroll-bar";
import { clsx } from "../../utils/classed";
import { Portal } from "../portal/portal";
import type { BaseProps } from "../slot/slot";
import { MenuSelectProvider, useMenuFloating } from "./menu-context";

export const MenuContent = (props: BaseProps<"div">) => {
  const { children, className, ...rest } = props;

  const {
    nested,
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

  return (
    <>
      {isMounted && (
        <Portal>
          {!nested && lockScroll && <RemoveScrollBar />}
          <FloatingFocusManager modal={false} initialFocus={nested ? -1 : 0} returnFocus={!nested} context={context}>
            <div
              className={clsx(
                "z-popup border-bd-normal bg-bg-normal rounded border p-1 shadow outline-none",
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
          </FloatingFocusManager>
        </Portal>
      )}
    </>
  );
};

if (__DEV__) {
  MenuContent.displayName = "MenuContent";
}
