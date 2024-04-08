import { __DEV__ } from "@resolid/utils";
import { clsx } from "../../utils/classed";
import { useFloatingAria } from "../floating/floatingAriaContext";
import type { BaseProps, EmptyProps } from "../slot/Slot";

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
