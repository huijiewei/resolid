import { __DEV__ } from "@resolid/utils";
import { clsx } from "../../utils/classed";
import type { BaseProps } from "../slot/slot";
import { type InputGroupContext, InputGroupProvider } from "./input-group-context";

export type InputGroupProps = Partial<InputGroupContext>;

export const InputGroup = (props: BaseProps<"div", InputGroupProps>) => {
  const { children, className, size = "md", ...rest } = props;

  return (
    <div className={clsx("flex items-stretch self-stretch", className)} {...rest}>
      <InputGroupProvider value={{ size }}>{children}</InputGroupProvider>
    </div>
  );
};

if (__DEV__) {
  InputGroup.displayName = "InputGroup";
}
