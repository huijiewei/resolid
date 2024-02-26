import { FloatingPortal } from "@floating-ui/react";
import { __DEV__ } from "@resolid/utils";
import type { MutableRefObject, PropsWithChildren } from "react";

export type PortalProps = {
  id?: string;
  root?: HTMLElement | null | MutableRefObject<HTMLElement | null>;
  preserveTabOrder?: boolean;
};

export const Portal = ({
  children,
  id = "resolid-portal",
  root = undefined,
  preserveTabOrder = true,
}: PropsWithChildren<PortalProps>) => {
  return (
    <FloatingPortal id={id} root={root} preserveTabOrder={preserveTabOrder}>
      {children}
    </FloatingPortal>
  );
};

if (__DEV__) {
  Portal.displayName = "Portal";
}
