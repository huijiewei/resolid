import { __DEV__ } from "@resolid/utils";
import { clsx } from "../../utils/classed";
import type { BaseProps } from "../slot/slot";
import { useMenuItemIndicator } from "./menu-item-indicator-context";

export const MenuItemIndicator = (props: BaseProps<"span">) => {
  const { className, children, ...rest } = props;

  const context = useMenuItemIndicator();

  return context.checked ? (
    <span className={clsx("absolute left-0 inline-flex w-6 items-center justify-center", className)} {...rest}>
      {children}
    </span>
  ) : null;
};

if (__DEV__) {
  MenuItemIndicator.displayName = "MenuItemIndicator";
}
