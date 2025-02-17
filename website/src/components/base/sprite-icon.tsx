import { tx } from "@resolid/react-ui";
import spriteIcons from "~/assets/icons/sprite.svg";

type SpriteIconProps = {
  name: string;
  size?: string | number;
  color?: string;
  className?: string;
};

export const SpriteIcon = (props: SpriteIconProps) => {
  const { name, size = "1em", color, className } = props;

  return (
    <svg style={{ width: size }} className={tx("mb-[-.1em] aspect-square", className)}>
      <use color={color} href={`${spriteIcons}#${name}`} />
    </svg>
  );
};
