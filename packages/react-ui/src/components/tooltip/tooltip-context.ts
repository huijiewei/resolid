import { createContext } from "../../utils/context";
import type { FloatingFloatingContext } from "../floating/floating-floating-context";

export type TooltipContext = FloatingFloatingContext & {
  duration: number;
  floatingClass?: string;
};

export const [TooltipFloatingProvider, useTooltipFloating] = createContext<TooltipContext>({
  strict: true,
  name: "TooltipFloatingContext",
});
