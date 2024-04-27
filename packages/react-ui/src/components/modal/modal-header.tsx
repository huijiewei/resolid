import { clsx } from "../../utils/classed";
import type { BaseProps, EmptyProps } from "../slot/slot";

export const ModalHeader = (props: BaseProps<"header">) => {
  const { children, className, ...rest } = props;

  return (
    <header className={clsx("flex-0 relative", className)} {...rest}>
      {children}
    </header>
  );
};
