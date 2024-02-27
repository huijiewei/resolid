import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@resolid/react-ui";
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

type ColorMode = keyof typeof colorModes;

export const ColorModeToggle = () => {
  return (
    <DropdownMenu placement={"bottom"}>
      <DropdownMenuTrigger asChild>
        <Button active={true} aria-label={"颜色模式"} color={"neutral"} variant={"ghost"} size={"sm"} square>
          <SpriteIcon name={"auto"} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={"text-sm"}>
        {Object.keys(colorModes).map((key) => {
          const mode = colorModes[key as ColorMode];

          return (
            <DropdownMenuItem key={key} onClick={() => {}}>
              <SpriteIcon size={"sm"} name={mode.icon} className={"me-1.5"} />
              <span>{mode.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
