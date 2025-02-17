import { tx } from "@resolid/react-ui";
import { isString } from "@resolid/utils";

import spriteIcons from "~/assets/icons/sprite.svg";

const iconSizes = {
  xs: "0.875rem",
  sm: "1.125rem",
  md: "1.5rem",
  lg: "1.75rem",
  xl: "2rem",
};

type IconSizes = keyof typeof iconSizes;

type SpriteIconProps = {
  name: string;
  size?: IconSizes | string | number;
  color?: string;
  className?: string;
};

export const SpriteIcon = (props: SpriteIconProps) => {
  const { name, size = "md", color, className } = props;

  const sizeValue =
    isString(size) && ["xs", "sm", "md", "lg", "xl"].includes(size) ? iconSizes[size as IconSizes] : size;

  return (
    <svg width={sizeValue} height={sizeValue} className={tx("aspect-square", className)}>
      <use color={color} href={`${spriteIcons}#${name}`} />
    </svg>
  );
};
