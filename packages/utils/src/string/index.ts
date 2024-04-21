import { customAlphabet } from "nanoid";

export const isString = (val: unknown): val is string => typeof val === "string";

export const isEmpty = (value: string | undefined | null) => {
  return value === undefined || value === null || value.trim().length === 0;
};

export const randomId = () => {
  const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");

  return nanoid(16);
};

export const startWith = (str: string, prefix: string, ignoreCase = true): boolean => {
  if (str.length < prefix.length) {
    return false;
  }

  const localStr = ignoreCase ? str.toLowerCase() : str;
  const localPrefix = ignoreCase ? prefix.toLowerCase() : prefix;

  for (let i = 0; i < localPrefix.length; i++) {
    if (localStr[i] !== localPrefix[i]) {
      return false;
    }
  }

  return true;
};

export const endWith = (str: string, suffix: string, ignoreCase = true) => {
  const diff = str.length - suffix.length;

  if (diff < 0) {
    return false;
  }

  const localStr = ignoreCase ? str.toLowerCase() : str;
  const localSuffix = ignoreCase ? suffix.toLowerCase() : suffix;

  if (diff > 0) {
    return localStr.indexOf(localSuffix, diff) === diff;
  }

  return localStr === localSuffix;
};

export const trimStart = (str: string, prefix: string, ignoreCase = true) => {
  if (startWith(str, prefix, ignoreCase)) {
    return str.slice(prefix.length, str.length);
  }

  return str;
};

export const trimEnd = (str: string, suffix: string, ignoreCase = true) => {
  if (endWith(str, suffix, ignoreCase)) {
    return str.slice(0, str.length - suffix.length);
  }

  return str;
};
