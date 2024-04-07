import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  useColorModeDispatch,
  useColorModeState,
  type ColorMode,
} from "@resolid/react-ui";
import { useEffect, useState } from "react";
import { SpriteIcon } from "~/components/base/SpriteIcon";

const colorModes = {
  light: {
    label: "亮色模式",
    icon: "sun",
  },
  dark: {
    label: "暗色模式",
    icon: "moon",
  },
  system: {
    label: "跟随系统",
    icon: "auto",
  },
};

export const ColorModeToggle = () => {
  const colorMode = useColorModeState();
  const setColorMode = useColorModeDispatch();

  const [colorModeState, setColorModeState] = useState(colorModes["system"]);

  useEffect(() => {
    setColorModeState(colorModes[colorMode]);
  }, [colorMode]);

  return (
    <DropdownMenu placement={"bottom"}>
      <DropdownMenuTrigger asChild>
        <Button active={true} aria-label={"颜色模式"} color={"neutral"} variant={"ghost"} size={"sm"} square>
          <SpriteIcon name={colorModeState.icon} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={"text-sm"}>
        {Object.keys(colorModes).map((key) => {
          const mode = colorModes[key as ColorMode];

          return (
            <DropdownMenuItem
              key={key}
              className={colorMode == key ? "text-link" : ""}
              onClick={() => {
                setColorMode(key as ColorMode);
              }}
            >
              <SpriteIcon size={"xs"} name={mode.icon} className={"me-1.5"} />
              <span>{mode.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
