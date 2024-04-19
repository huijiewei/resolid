import type { ReactNode } from "react";
import { createContext } from "../../utils/context";

export type BreadcrumbContext = {
  /**
   * 每个面包屑项目之间的视觉分隔符
   * @default <SlashIcon>
   */
  separator?: ReactNode;
};

export const [BreadcrumbProvider, useBreadcrumb] = createContext<BreadcrumbContext>({
  strict: true,
  name: "BreadcrumbContext",
});
