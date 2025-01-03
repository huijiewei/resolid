import { __DEV__ } from "@resolid/utils";
import { clsx } from "../../utils/classed";
import type { BaseProps } from "../slot/slot";

export const PopoverFooter = (props: BaseProps<"footer">) => {
  const { children, className, ...rest } = props;

  return (
    <footer className={clsx("border-t-bg-subtle border-t p-4", className)} {...rest}>
      {children}
    </footer>
  );
};

if (__DEV__) {
  PopoverFooter.displayName = "PopoverFooter";
}
