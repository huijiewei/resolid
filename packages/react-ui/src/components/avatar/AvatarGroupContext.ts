import { createContext } from "../../utils/context";
import type { Radius } from "../../utils/radius";
import type { Size, Styled } from "../../utils/types";

type AvatarGroupContext = {
  /**
   * Size
   * @default 'md'
   */
  size: number | Size;

  /**
   * Rounded
   * @default 'full'
   */
  radius: Radius;

  rounded: Styled;

  sized: Styled;
};

export type AvatarBaseProps = Partial<Omit<AvatarGroupContext, "rounded" | "sized">>;

const [AvatarGroupProvider, useAvatarGroup] = createContext<AvatarGroupContext | undefined>({
  strict: false,
  name: "AvatarGroupContext",
});

export { AvatarGroupProvider, useAvatarGroup };
