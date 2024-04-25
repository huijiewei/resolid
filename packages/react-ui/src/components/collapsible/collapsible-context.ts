import { createContext } from "../../utils/context";

type CollapsibleContext = {
  id: string;
  disabled: boolean;
};

type CollapsibleTriggerContext = CollapsibleContext & {
  opened: boolean;
  toggle: () => void;
};

export const [CollapsibleTriggerProvider, useCollapsibleTrigger] = createContext<CollapsibleTriggerContext>({
  strict: true,
  name: "CollapsibleTriggerContext",
});

type CollapsibleContentContext = CollapsibleContext & {
  mounted: boolean;
  status: "unmounted" | "initial" | "open" | "close";
  duration: number;
  setElement: (node: HTMLElement) => void;
};

export const [CollapsibleContentProvider, useCollapsibleContent] = createContext<CollapsibleContentContext>({
  strict: true,
  name: "CollapsibleContentContext",
});
