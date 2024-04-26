import { clsx } from "../../utils/classed";
import { dataAttr } from "../../utils/dom";
import { type AsChildProps, Slot } from "../slot/slot";
import { makeContentId, makeTriggerId, useTabs } from "./tabs-context";

type TabsTriggerProps = {
  /**
   * 将内容与触发器关联起来的唯一值
   */
  value: string;
};

export const TabsTrigger = (props: AsChildProps<"button", TabsTriggerProps, "type" | "role" | "id">) => {
  const { asChild = false, disabled = false, children, className, value, ...rest } = props;

  const Comp = asChild ? Slot : "button";

  const { baseId, selectedValue, setSelectedValue, orientation } = useTabs();

  const triggerId = makeTriggerId(baseId, value);
  const contentId = makeContentId(baseId, value);
  const selected = value === selectedValue;

  const handleClick = () => {
    if (disabled) {
      return;
    }

    setSelectedValue(value);
  };

  return (
    <Comp
      id={triggerId}
      aria-controls={contentId}
      data-active={dataAttr(selected)}
      type={asChild ? undefined : "button"}
      role={"tab"}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      className={clsx(
        orientation == "horizontal" ? "-mb-px border-b" : "-mr-px border-r",
        "px-4 py-2 transition-colors",
        disabled ? "cursor-not-allowed text-fg-subtle" : "active:border-fg-primary active:text-fg-primary",
        className,
      )}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </Comp>
  );
};
