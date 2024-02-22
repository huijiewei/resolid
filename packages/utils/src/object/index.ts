import { isFunction } from "../function";

export const isObject = (value: unknown): boolean => value !== null && typeof value === "object";

export const hasOwnProperty = <T extends object>(object: T, prop: string | number | symbol): prop is keyof T => {
  if (isFunction(Object.hasOwn)) {
    return Object.hasOwn(object, prop);
  }

  return Object.prototype.hasOwnProperty.call(object, prop);
};
