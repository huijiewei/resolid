import { __DEV__ } from "@resolid/utils";
import { clsx } from "../../utils/classed";
import { useFloatingAria } from "../floating/floatingAriaContext";
import type { BaseProps, EmptyProps } from "../slot/Slot";

export const ModalHeader = (props: BaseProps<"header", EmptyProps, "id">) => {
  const { children, className, ...rest } = props;

  const { labelId } = useFloatingAria();

  return (
    <header id={labelId} className={clsx("flex-0 p-4 text-lg font-bold", className)} {...rest}>
      {children}
    </header>
  );
};

if (__DEV__) {
  ModalHeader.displayName = "ModalHeader";
}
