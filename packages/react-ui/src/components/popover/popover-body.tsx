import { __DEV__ } from "@resolid/utils";
import { clsx } from "../../utils/classed";
import { useFloatingAria } from "../floating/floating-aria-context";
import type { BaseProps, EmptyProps } from "../slot/slot";

export const PopoverBody = (props: BaseProps<"div", EmptyProps, "id">) => {
  const { children, className, ...rest } = props;

  const { descriptionId } = useFloatingAria();

  return (
    <div id={descriptionId} className={clsx("p-4", className)} {...rest}>
      {children}
    </div>
  );
};

if (__DEV__) {
  PopoverBody.displayName = "PopoverBody";
}
