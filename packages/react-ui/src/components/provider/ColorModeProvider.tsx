import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useLocalStorage, useMediaQuery } from "../../hooks";
import { COLOR_MODE_STORAGE_KEY, COLOR_SCHEME_QUERY } from "./colorModeConstant";
import { ColorModeDispatchProvider, ColorModeStateProvider, type ColorMode } from "./colorModeContext";

export const ColorModeProvider = ({ children }: PropsWithChildren) => {
  const darkOS = useMediaQuery(COLOR_SCHEME_QUERY);

  const [colorMode, setColorMode] = useLocalStorage<ColorMode>(COLOR_MODE_STORAGE_KEY, "system");

  useEffect(() => {
    const isDark = colorMode == "dark" || (colorMode == "system" && darkOS);

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [colorMode, darkOS]);

  return (
    <ColorModeDispatchProvider value={setColorMode}>
      <ColorModeStateProvider value={colorMode}>{children}</ColorModeStateProvider>
    </ColorModeDispatchProvider>
  );
};
