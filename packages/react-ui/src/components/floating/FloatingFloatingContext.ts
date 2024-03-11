import type { FloatingContext } from "@floating-ui/react";
import type { CSSProperties, HTMLProps } from "react";

export type FloatingFloatingContext = {
  context: FloatingContext;
  floatingStyles: CSSProperties;
  setFloating: (node: HTMLElement) => void;
  getFloatingProps: (userProps?: HTMLProps<HTMLElement> | undefined) => Record<string, unknown>;
};
