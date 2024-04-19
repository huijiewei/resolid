import { createContext } from "../../utils/context";

export type FloatingDispatchContext = {
  open?: () => void;
  close: () => void;
};

export const [FloatingDispatchProvider, useFloatingDispatch] = createContext<FloatingDispatchContext>({
  strict: true,
  name: "FloatingDispatchContext",
});
