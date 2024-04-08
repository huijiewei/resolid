export type AnyFunction<A = unknown, R = unknown> = (...args: A[]) => R;
export type MaybeFunction<R = unknown, A = unknown> = R | AnyFunction<A, R>;

export const isFunction = <T = AnyFunction>(value: unknown): value is T => typeof value === "function";

export const runIfFunction = <R, A>(valueOrFunction: R | AnyFunction<A, R>, ...args: A[]): R => {
  return isFunction<AnyFunction<A, R>>(valueOrFunction) ? valueOrFunction(...args) : valueOrFunction;
};
