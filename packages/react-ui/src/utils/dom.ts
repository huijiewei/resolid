import { type Booleanish, isObject } from "@resolid/utils";

export const dataAttr = (condition: boolean | null | undefined) => (condition ? "" : undefined) as Booleanish;

export const ariaAttr = (condition: boolean | null | undefined) => (condition ? true : undefined);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isInputEvent = (value: any): value is { target: HTMLInputElement } => {
  return value && isObject(value) && isObject(value.target);
};

export const composeEventHandlers =
  <E>(
    originalEventHandler?: (event: E) => void,
    ourEventHandler?: (event: E) => void,
    { checkDefaultPrevented = true } = {},
  ) =>
  (event: E) => {
    originalEventHandler?.(event);

    if (!checkDefaultPrevented || !(event as unknown as Event).defaultPrevented) {
      return ourEventHandler?.(event);
    }
  };
