export type AnyFunction<A = unknown, R = unknown> = (...args: A[]) => R;
export type MaybeFunction<T, A extends unknown[] = []> = T | AnyFunction<A, T>;

export const isFunction = <T = AnyFunction>(value: unknown): value is T => typeof value === "function";

export const noop = () => {};
