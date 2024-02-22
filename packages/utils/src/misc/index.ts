import { startWith } from "../string";

export type Overwrite<T, U> = Omit<T, keyof U> & U;

export const __DEV__ = process.env.NODE_ENV !== "production";

export const isExternalUrl = (url: string) => {
  return startWith(url, "http://") || startWith(url, "https://");
};
