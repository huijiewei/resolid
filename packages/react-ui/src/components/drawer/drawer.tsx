import { __DEV__ } from "@resolid/utils";
import type { PropsWithChildren } from "react";
import { Modal, type ModalRootProps } from "../modal/modal";
import { DrawerProvider, type DrawerPlacement } from "./drawer-context";

export type DrawerProps = Omit<ModalRootProps, "scrollBehavior" | "lockScroll"> & {
  /**
   * 放置位置
   * @default 'right'
   */
  placement?: DrawerPlacement;
};

export const Drawer = (props: PropsWithChildren<DrawerProps>) => {
  const { placement = "right", children, ...rest } = props;

  return (
    <DrawerProvider value={{ placement }}>
      <Modal scrollBehavior={"inside"} {...rest}>
        {children}
      </Modal>
    </DrawerProvider>
  );
};

if (__DEV__) {
  Drawer.displayName = "Drawer";
}

export { ModalBody as DrawerBody } from "../modal/modal-body";
export { ModalCloseButton as DrawerCloseButton } from "../modal/modal-close-button";
export { ModalFooter as DrawerFooter } from "../modal/modal-footer";
export { ModalHeader as DrawerHeader } from "../modal/modal-header";
export { ModalOverlay as DrawerOverlay } from "../modal/modal-overlay";
export { DrawerContent } from "./drawer-content";
