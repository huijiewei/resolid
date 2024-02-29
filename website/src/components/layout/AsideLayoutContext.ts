import { createContext } from "@resolid/react-ui";
import type { Dispatch, SetStateAction } from "react";

const [AsideLayoutStateProvider, useAsideLayoutState] = createContext<boolean>({
  name: "AsideLayoutStateContext",
  strict: true,
});

const [AsideLayoutDispatchProvider, useAsideLayoutDispatch] = createContext<Dispatch<SetStateAction<boolean>>>({
  name: "AsideLayoutDispatchContext",
  strict: true,
});

export { AsideLayoutDispatchProvider, AsideLayoutStateProvider, useAsideLayoutDispatch, useAsideLayoutState };
