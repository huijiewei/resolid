import { createContext } from "../../utils/context";
import type { Radius } from "../../utils/radius";
import type { Size, Styled } from "../../utils/types";

export type AvatarBaseProps = {
  /**
   * 头像大小
   * @default 'md'
   */
  size?: number | Size;

  /**
   * 头像圆角
   * @default 'full'
   */
  radius?: Radius;
};

type AvatarGroupContext = {
  sized: Styled;
  rounded: Styled;
};

export const [AvatarGroupProvider, useAvatarGroup] = createContext<AvatarGroupContext | undefined>({
  strict: false,
  name: "AvatarGroupContext",
});
