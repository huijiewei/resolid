import {
  Button,
  type ColorMode,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  useColorModeDispatch,
  useColorModeState,
} from "@resolid/react-ui";
import { SpriteIcon } from "~/components/base/sprite-icon";

const colorModes = {
  light: {
    label: "亮色模式",
    icon: "sun",
  },
  dark: {
    label: "暗色模式",
    icon: "moon",
  },
  auto: {
    label: "跟随系统",
    icon: "auto",
  },
};

export const ColorModeToggle = () => {
  const colorMode = useColorModeState();
  const setColorMode = useColorModeDispatch();

  return (
    <DropdownMenu placement={"bottom"}>
      <DropdownMenuTrigger
        aria-label={"颜色模式"}
        render={(props) => <Button {...props} color={"neutral"} variant={"ghost"} size={"sm"} iconOnly />}
      >
        <SpriteIcon size={"1.5em"} name={colorModes[colorMode]?.icon} />
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
              <SpriteIcon name={mode.icon} className={"me-1.5"} />
              {mode.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
