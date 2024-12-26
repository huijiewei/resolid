import { clsx } from "../../utils/classed";
import { useFloatingAria } from "../floating/floating-aria-context";
import type { BaseProps, EmptyProps } from "../slot/slot";

export const ModalTitle = (props: BaseProps<"h2", EmptyProps, "id">) => {
  const { children, className, ...rest } = props;

  const { labelId } = useFloatingAria();

  return (
    <h2 id={labelId} className={clsx("text-lg font-bold", className)} {...rest}>
      {children}
    </h2>
  );
};
