import { clsx } from "@resolid/react-ui";
import { isString } from "@resolid/utils";

const spriteIcons = import.meta.glob("../../assets/icons/*.svg", { query: "?url", import: "default", eager: true });

const iconSizes = {
  xs: "0.813rem",
  sm: "1rem",
  md: "1.5rem",
  lg: "2rem",
  xl: "3rem",
};

type IconSizes = keyof typeof iconSizes;

type SpriteIconProps = {
  name: string;
  size?: IconSizes | string | number;
  color?: string;
  className?: string;
  group?: string;
};

export const SpriteIcon = (props: SpriteIconProps) => {
  const { name, group = "common", size = "md", color, className } = props;

  const groupModule = `../../assets/icons/${group}.svg`;

  const sizeValue =
    isString(size) && ["xs", "sm", "md", "lg", "xl"].includes(size) ? iconSizes[size as IconSizes] : size;

  return (
    <svg width={sizeValue} height={sizeValue} className={clsx("aspect-square", className)}>
      <use color={color} href={`${spriteIcons[groupModule]}#${name}`} />
    </svg>
  );
};
