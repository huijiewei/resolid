import { useId, useMemo } from "react";
import { useControllableState } from "../../hooks";
import { clsx } from "../../utils/classed";
import type { BaseProps } from "../slot/slot";
import { TabsProvider, type TabsContext } from "./tabs-context";

export type TabsRootProps = {
  /**
   * 可控值
   */
  value?: string;

  /**
   * onChange 回调
   */
  onChange?: (value: string) => void;

  /**
   * 默认值
   */
  defaultValue: string;

  /**
   * 方向
   * @default 'horizontal'
   */
  orientation?: "vertical" | "horizontal";
};

export const TabsRoot = (props: BaseProps<"div", TabsRootProps, "id">) => {
  const { children, className, value, defaultValue, onChange, orientation = "horizontal", ...rest } = props;

  const [valueState, setValueState] = useControllableState({ value, defaultValue, onChange });

  const baseId = useId();

  const context = useMemo<TabsContext>(() => {
    return {
      baseId,
      selectedValue: valueState,
      setSelectedValue: setValueState,
      orientation,
    };
  }, [baseId, orientation, setValueState, valueState]);

  return (
    <TabsProvider value={context}>
      <div className={clsx("flex w-full", orientation == "horizontal" ? "flex-col" : "flex-row", className)} {...rest}>
        {children}
      </div>
    </TabsProvider>
  );
};
