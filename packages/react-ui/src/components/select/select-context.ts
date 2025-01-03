import type { HTMLProps, ReactNode, RefObject } from "react";
import { createContext } from "../../utils/context";

export type OptionBase = {
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  elementsRef: RefObject<(HTMLDivElement | null)[]>;
  getItemProps: (userProps?: HTMLProps<HTMLElement> | undefined) => Record<string, unknown>;
};

export const [SelectProvider, useSelect] = createContext<SelectContext>({
  strict: true,
  name: "SelectContext",
});
