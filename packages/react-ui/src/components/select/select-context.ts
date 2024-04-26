import type { HTMLProps, MutableRefObject, ReactNode } from "react";
import { createContext } from "../../utils/context";

export type OptionBase = {
  disabled?: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [key: string]: any;
};

export type OptionDefault = {
  label: ReactNode;
  value?: string | number | null;
  options?: Omit<OptionDefault, "options">[];
} & OptionBase;

export type OptionFieldNames = {
  value?: string;
  label?: string;
  options?: string;
};

export type SelectContext = {
  activeIndex: number | null;
  selectedIndex: number[];
  elementsRef: MutableRefObject<(HTMLDivElement | null)[]>;
  getItemProps: (userProps?: HTMLProps<HTMLElement> | undefined) => Record<string, unknown>;
};

export const [SelectProvider, useSelect] = createContext<SelectContext>({
  strict: true,
  name: "SelectContext",
});
