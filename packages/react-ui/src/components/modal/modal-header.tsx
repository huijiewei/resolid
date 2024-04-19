import { __DEV__ } from "@resolid/utils";
import { clsx } from "../../utils/classed";
import { useFloatingAria } from "../floating/floating-aria-context";
import type { BaseProps, EmptyProps } from "../slot/slot";

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
