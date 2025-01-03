import { type Overwrite, __DEV__, hasOwn, isFunction } from "@resolid/utils";
import {
  Children,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type JSX,
  type ReactNode,
  cloneElement,
  forwardRef,
  isValidElement,
} from "react";
import { mergeRefs } from "../../hooks";

export type EmptyProps = Record<never, never>;

export type BaseProps<
  T extends keyof JSX.IntrinsicElements,
  P extends object = EmptyProps,
  O extends string | number | symbol = never,
> = Overwrite<Omit<ComponentPropsWithoutRef<T>, O>, P>;

export type AsChildProps<
  T extends keyof JSX.IntrinsicElements,
  P extends object = EmptyProps,
  O extends string | number | symbol = never,
> = BaseProps<T, P, O> & {
  /**
   * 渲染为子组件
   * @default false
   */
  asChild?: boolean;
};

type SlotProps = {
  children: ReactNode;
};

export const Slot = forwardRef<unknown, SlotProps>((props, ref) => {
  const { children, ...rest } = props;

  if (isValidElement(children)) {
    return cloneElement(children, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...mergeProps(rest, (children as any).props),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref: ref ? mergeRefs(ref, (children as any).ref) : (children as any).ref,
    });
  }

  return Children.count(children) > 1 ? Children.only(null) : null;
});

if (__DEV__) {
  Slot.displayName = "Slot";
}

const mergeProps = <T extends HTMLAttributes<HTMLElement>>(base: T, overrides: T) => {
  const props = { ...base };

  for (const key in overrides) {
    if (!hasOwn(overrides, key)) {
      continue;
    }

    if (key === "className") {
      const prop = "className";
      props[prop] = base[prop] ? `${base[prop]} ${overrides[prop]}` : overrides[prop];
      continue;
    }

    if (key === "style") {
      const prop = "style";
      props[prop] = base[prop] ? { ...base[prop], ...overrides[prop] } : overrides[prop];
      continue;
    }

    const overrideValue = overrides[key];

    if (isFunction(overrideValue) && key.startsWith("on")) {
      const baseValue = base[key];

      if (isFunction(baseValue)) {
        type EventKey = Extract<keyof HTMLAttributes<Element>, `on${string}`>;
        props[key as EventKey] = (...args) => {
          overrideValue(...args);
          baseValue(...args);
        };
        continue;
      }
    }

    props[key] = overrideValue;
  }

  return props;
};
