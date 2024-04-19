import { createContext } from "@resolid/react-ui";
import type { Dispatch, SetStateAction } from "react";

export const [AsideLayoutStateProvider, useAsideLayoutState] = createContext<boolean>({
  name: "AsideLayoutStateContext",
  strict: true,
});

export const [AsideLayoutDispatchProvider, useAsideLayoutDispatch] = createContext<Dispatch<SetStateAction<boolean>>>({
  name: "AsideLayoutDispatchContext",
  strict: true,
});
