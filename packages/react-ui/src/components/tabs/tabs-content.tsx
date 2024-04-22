import { clsx } from "../../utils/classed";
import type { BaseProps } from "../slot/slot";
import { makeContentId, makeTriggerId, useTabs } from "./tabs-context";

export type TabsContentProps = {
  /**
   * 将内容与触发器关联起来的唯一值
   */
  value: string;
};

export const TabsContent = (
  props: BaseProps<"div", TabsContentProps, "id" | "tabIndex" | "role" | "aria-labelledby">,
) => {
  const { children, className, value, ...rest } = props;

  const { baseId, selectedValue, orientation } = useTabs();

  const triggerId = makeTriggerId(baseId, value);
  const contentId = makeContentId(baseId, value);
  const selected = value === selectedValue;

  return (
    <div
      id={contentId}
      tabIndex={0}
      role="tabpanel"
      aria-labelledby={triggerId}
      className={clsx(orientation == "horizontal" ? "mt-4" : "ml-4", selected ? "block" : "hidden", className)}
      {...rest}
    >
      {children}
    </div>
  );
};
