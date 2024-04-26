import { runIfFunction } from "@resolid/utils";
import { type ReactNode, useId } from "react";
import { useDisclosure, useElementTransitionStatus } from "../../hooks";
import type { BaseProps } from "../slot/slot";
import { CollapsibleContentProvider, CollapsibleTriggerProvider } from "./collapsible-context";

export type CollapsibleRootProps = {
  /**
   * 可折叠的受控打开状态
   */
  open?: boolean;

  /**
   * 可折叠的默认打开状态
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * 是否禁用可折叠
   * @default false
   */
  disabled?: boolean;

  /**
   * 当可折叠打开时调用事件处理程序
   */
  onOpen?: () => void;

  /**
   * 当可折叠关闭时调用事件处理程序
   */
  onClose?: () => void;

  /**
   * 动画持续时间
   * @default '250'
   */
  duration?: number;

  /**
   * @ignore
   */
  children?: ReactNode | ((props: { opened: boolean; close: () => void }) => ReactNode);
};

export const CollapsibleRoot = (props: BaseProps<"div", CollapsibleRootProps>) => {
  const { children, duration = 250, open, defaultOpen = false, disabled = false, onOpen, onClose, ...rest } = props;

  const [opened, { close, toggle }] = useDisclosure({ opened: open, defaultOpened: defaultOpen, onOpen, onClose });

  const id = useId();

  const { isMounted, status, setElement } = useElementTransitionStatus(opened, { duration });

  const triggerContext = { id, opened, toggle, disabled };

  const contentContext = { id, mounted: isMounted, status, duration, disabled, setElement };

  return (
    <div {...rest}>
      <CollapsibleTriggerProvider value={triggerContext}>
        <CollapsibleContentProvider value={contentContext}>
          {runIfFunction(children, { opened, close })}
        </CollapsibleContentProvider>
      </CollapsibleTriggerProvider>
    </div>
  );
};
