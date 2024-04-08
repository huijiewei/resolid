import { createContext } from "../../utils/context";
import type { FloatingFloatingContext } from "../floating/floatingFloatingContext";

export { TooltipFloatingProvider, useTooltipFloating };

export type TooltipContext = FloatingFloatingContext & {
  duration: number;
  floatingClass?: string;
};

const [TooltipFloatingProvider, useTooltipFloating] = createContext<TooltipContext>({
  strict: true,
  name: "TooltipFloatingContext",
});
