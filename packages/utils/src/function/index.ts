export type AnyFunction<R, A> = (...args: A[]) => R;
export type MaybeFunction<R, A = unknown> = R | AnyFunction<A, R>;

export const isFunction = <R, A>(value: unknown): value is AnyFunction<R, A> => typeof value === "function";

export const runIfFunction = <R, A>(valueOrFunction: R | AnyFunction<R, A>, ...args: A[]): R => {
  return isFunction<R, A>(valueOrFunction) ? valueOrFunction(...args) : valueOrFunction;
};
