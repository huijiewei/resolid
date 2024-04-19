import type { MutableRefObject } from "react";
import { createContext } from "../../utils/context";
import type { FloatingFloatingContext } from "../floating/floating-floating-context";

export type PopoverContext = FloatingFloatingContext & {
  modal: boolean;
  duration: number;
  mounted: boolean;
  trigger: "click" | "hover";
  status: "unmounted" | "initial" | "open" | "close";
  initialFocus?: number | MutableRefObject<HTMLElement | null>;
};

export const [PopoverFloatingProvider, usePopoverFloating] = createContext<PopoverContext>({
  strict: true,
  name: "PopoverFloatingContext",
});
