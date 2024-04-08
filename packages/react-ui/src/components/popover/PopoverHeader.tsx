import { __DEV__ } from "@resolid/utils";
import { clsx } from "../../utils/classed";
import { useFloatingAria } from "../floating/floatingAriaContext";
import type { BaseProps, EmptyProps } from "../slot/Slot";

export const PopoverHeader = (props: BaseProps<"header", EmptyProps, "id">) => {
  const { children, className, ...rest } = props;

  const { labelId } = useFloatingAria();

  return (
    <header id={labelId} className={clsx("border-b border-b-bd-subtle p-4", className)} {...rest}>
      {children}
    </header>
  );
};

if (__DEV__) {
  PopoverHeader.displayName = "PopoverHeader";
}
