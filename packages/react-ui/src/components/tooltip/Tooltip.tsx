import { FloatingArrow } from '../floating/FloatingArrow';
import { FloatingTrigger } from '../floating/FloatingTrigger';
import { TooltipContent } from './TooltipContent';
import { TooltipRoot, type TooltipProps } from './TooltipRoot';

export type { TooltipProps };

export const Tooltip = {
  Root: TooltipRoot,
  Trigger: FloatingTrigger,
  Arrow: FloatingArrow,
  Content: TooltipContent,
};
