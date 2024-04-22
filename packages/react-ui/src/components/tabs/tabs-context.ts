import { createContext } from "../../utils/context";

export type TabsContext = {
  baseId: string;
  selectedValue?: string;
  setSelectedValue: (value: string) => void;
  orientation: "vertical" | "horizontal";
};

export const [TabsProvider, useTabs] = createContext<TabsContext>({
  strict: true,
  name: "TabsContext",
});

export const makeTriggerId = (baseId: string, value: string) => `${baseId}-trigger-${value}`;

export const makeContentId = (baseId: string, value: string) => `${baseId}-content-${value}`;
