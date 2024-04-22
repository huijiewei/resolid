import { clsx } from "../../utils/classed";
import type { BaseProps, EmptyProps } from "../slot/slot";
import { useTabs } from "./tabs-context";

export const TabsList = (props: BaseProps<"div", EmptyProps, "role">) => {
  const { children, className, ...rest } = props;

  const { orientation } = useTabs();

  return (
    <div
      role={"tablist"}
      className={clsx(
        "relative flex shrink-0",
        orientation == "horizontal" ? "flex-row border-b" : "flex-col border-r",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
