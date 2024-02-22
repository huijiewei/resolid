const spriteIcons = import.meta.glob("../assets/icons/*.svg", { query: "?url", import: "default", eager: true });

type SpriteIconProps = {
  name: string;
  size?: string | number;
  color?: string;
  className?: string;
  group?: string;
};

export const SpriteIcon = (props: SpriteIconProps) => {
  const { name, group = "common", size, color, className } = props;

  const groupModule = `../assets/icons/${group}.svg`;

  const sizeValue = size ?? "1.1em";

  return (
    <svg width={sizeValue} height={sizeValue} className={className}>
      <use color={color} href={`${spriteIcons[groupModule]}#${name}`} />
    </svg>
  );
};
