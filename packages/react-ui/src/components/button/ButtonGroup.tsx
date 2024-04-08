import { __DEV__ } from "@resolid/utils";
import { useMemo } from "react";
import { clsx } from "../../utils/classed";
import type { BaseProps } from "../slot/Slot";
import { ButtonGroupProvider, type ButtonGroupContext } from "./buttonGroupContext";

export type ButtonGroupProps = ButtonGroupContext;

export const ButtonGroup = (props: BaseProps<"div", ButtonGroupProps, "role">) => {
  const { children, vertical = false, size, color, variant, className, ...rest } = props;

  const context = useMemo(() => ({ size, color, variant, vertical }), [size, color, variant, vertical]);

  return (
    <div role={"group"} className={clsx("inline-flex", vertical ? "flex-col" : "flex-row", className)} {...rest}>
      <ButtonGroupProvider value={context}>{children}</ButtonGroupProvider>
    </div>
  );
};

if (__DEV__) {
  ButtonGroup.displayName = "ButtonGroup";
}
