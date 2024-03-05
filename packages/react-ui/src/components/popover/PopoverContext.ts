import type { MutableRefObject } from 'react';
import { createContext } from '../../utils/context';
import type { FloatingFloatingContext } from '../floating/FloatingFloatingContext';

export { PopoverFloatingProvider, usePopoverFloating };

export type PopoverContext = FloatingFloatingContext & {
  modal: boolean;
  duration: number;
  initialFocus?: number | MutableRefObject<HTMLElement | null>;
};

const [PopoverFloatingProvider, usePopoverFloating] = createContext<PopoverContext>({
  strict: true,
  name: 'PopoverFloatingContext',
});
