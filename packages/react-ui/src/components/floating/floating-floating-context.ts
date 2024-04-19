import type { FloatingContext } from "@floating-ui/react";
import type { CSSProperties, HTMLProps } from "react";

export type FloatingFloatingContext = {
  context: FloatingContext;
  floatingStyles: CSSProperties;
  setFloating: (node: HTMLElement | null) => void;
  getFloatingProps: (userProps?: HTMLProps<HTMLElement> | undefined) => Record<string, unknown>;
};
