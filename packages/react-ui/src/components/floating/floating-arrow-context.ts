import type { FloatingContext } from "@floating-ui/react";
import type { RefObject } from "react";
import { createContext } from "../../utils/context";

export type FloatingArrowContext = {
  context: FloatingContext;
  setArrow: RefObject<SVGSVGElement | null>;
  className?: string;
};

export const [FloatingArrowProvider, useFloatingArrow] = createContext<FloatingArrowContext>({
  strict: true,
  name: "FloatingArrowContext",
});
