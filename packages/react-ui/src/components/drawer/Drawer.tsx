import { __DEV__ } from "@resolid/utils";
import type { PropsWithChildren } from "react";
import { Modal, type ModalProps } from "../modal/Modal";
import { DrawerProvider, type DrawerPlacement } from "./drawerContext";

export type DrawerProps = Omit<ModalProps, "scrollBehavior" | "lockScroll"> & {
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

export { ModalBody as DrawerBody } from "../modal/ModalBody";
export { ModalCloseButton as DrawerCloseButton } from "../modal/ModalCloseButton";
export { ModalFooter as DrawerFooter } from "../modal/ModalFooter";
export { ModalHeader as DrawerHeader } from "../modal/ModalHeader";
export { ModalOverlay as DrawerOverlay } from "../modal/ModalOverlay";
export { DrawerContent } from "./DrawerContent";
