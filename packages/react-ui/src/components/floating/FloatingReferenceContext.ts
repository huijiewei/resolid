import type { ReferenceType } from '@floating-ui/react';
import { type HTMLProps } from 'react';
import { createContext } from '../../utils/context';

export type FloatingReferenceContext = {
  opened: boolean;
  setReference: (node: ReferenceType | null) => void;
  setPositionReference: (node: ReferenceType | null) => void;
  getReferenceProps: (userProps?: HTMLProps<Element> | undefined) => Record<string, unknown>;
};

const [FloatingReferenceProvider, useFloatingReference] = createContext<FloatingReferenceContext>({
  strict: true,
  name: 'FloatingReferenceContext',
});

export { FloatingReferenceProvider, useFloatingReference };
