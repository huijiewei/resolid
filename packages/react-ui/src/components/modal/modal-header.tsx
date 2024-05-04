import { clsx } from "../../utils/classed";
import type { BaseProps, EmptyProps } from "../slot/slot";

export const ModalHeader = (props: BaseProps<"header">) => {
  const { children, className, ...rest } = props;

  return (
    <header className={clsx("relative flex-0", className)} {...rest}>
      {children}
    </header>
  );
};
