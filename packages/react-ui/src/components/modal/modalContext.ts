import type { FloatingContext } from "@floating-ui/react";
import type { HTMLProps, RefObject } from "react";
import { createContext } from "../../utils/context";

export type ModalBaseProps = {
  /**
   * 控制打开状态
   */
  opened: boolean;

  /**
   * 垂直居中显示
   */
  centered?: boolean;

  /**
   * 锁定页面滚动条
   * @default true
   */
  lockScroll?: boolean;

  /**
   * 开启后焦点目标
   */
  initialFocus?: number | RefObject<HTMLElement>;

  /**
   * 关闭后焦点目标
   */
  finalFocus?: RefObject<HTMLElement>;

  /**
   * 滚动行为
   * @default 'outside'
   */
  scrollBehavior?: "inside" | "outside";
};

export type ModalContext = ModalBaseProps & {
  status: "unmounted" | "initial" | "open" | "close";
  duration: number;
  context: FloatingContext<HTMLElement>;
  setFloating: (node: HTMLElement | null) => void;
  getFloatingProps: (userProps?: HTMLProps<HTMLElement> | undefined) => Record<string, unknown>;
};

const [ModalProvider, useModal] = createContext<ModalContext>({
  strict: true,
  name: "ModalContext",
});

export { ModalProvider, useModal };
