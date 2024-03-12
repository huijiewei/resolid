import { createContext } from "../../utils/context";

export type FloatingAriaContext = {
  labelId: string;
  descriptionId: string;
};

const [FloatingAriaProvider, useFloatingAria] = createContext<FloatingAriaContext>({
  strict: true,
  name: "FloatingAriaContext",
});

export { FloatingAriaProvider, useFloatingAria };
