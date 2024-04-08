import type { FloatingContext } from "@floating-ui/react";
import type { RefObject } from "react";
import { createContext } from "../../utils/context";

export type FloatingArrowContext = {
  context: FloatingContext;
  setArrow: RefObject<SVGSVGElement>;
  className?: string;
};

const [FloatingArrowProvider, useFloatingArrow] = createContext<FloatingArrowContext>({
  strict: true,
  name: "FloatingArrowContext",
});

export { FloatingArrowProvider, useFloatingArrow };
