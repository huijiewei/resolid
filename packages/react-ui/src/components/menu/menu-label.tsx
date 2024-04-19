import { __DEV__ } from "@resolid/utils";
import { clsx } from "../../utils/classed";
import type { BaseProps } from "../slot/slot";

export const MenuLabel = (props: BaseProps<"div">) => {
  const { children, className, ...rest } = props;

  return (
    <div className={clsx("flex w-full items-center px-2 py-1.5 outline-none", className)} {...rest}>
      {children}
    </div>
  );
};

if (__DEV__) {
  MenuLabel.displayName = "MenuLabel";
}
