import { __DEV__ } from "@resolid/utils";
import { clsx } from "../../utils/classed";
import type { BaseProps } from "../slot/Slot";

export const BreadcrumbItem = (props: BaseProps<"li">) => {
  const { className, children, ...rest } = props;

  return (
    <li className={clsx("inline-flex items-center", className)} {...rest}>
      {children}
    </li>
  );
};

if (__DEV__) {
  BreadcrumbItem.displayName = "BreadcrumbItem";
}
