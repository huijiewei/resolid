import { createContext } from "../../utils/context";
import type { Radius } from "../../utils/radius";
import type { Size, Styled } from "../../utils/types";

type AvatarGroupContext = {
  /**
   * 头像大小
   * @default 'md'
   */
  size: number | Size;

  /**
   * 头像圆角
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
