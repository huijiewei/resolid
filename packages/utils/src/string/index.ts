export const isString = (val: unknown): val is string => typeof val === "string";

export const isEmpty = (value: string | undefined | null) => {
  return value === undefined || value === null || value.trim().length === 0;
};

export const startWith = (str: string, prefix: string, ignoreCase = true): boolean => {
  if (str.length < prefix.length) {
    return false;
  }

  if (ignoreCase) {
    str = str.toLowerCase();
    prefix = prefix.toLowerCase();
  }

  for (let i = 0; i < prefix.length; i++) {
    if (str[i] !== prefix[i]) {
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

  if (ignoreCase) {
    str = str.toLowerCase();
    suffix = suffix.toLowerCase();
  }

  if (diff > 0) {
    return str.indexOf(suffix, diff) === diff;
  }

  return str === suffix;
};

export const trimStart = (str: string, prefix: string, ignoreCase = true) => {
  if (startWith(str, prefix, ignoreCase)) {
    return str.substring(prefix.length, str.length);
  }

  return str;
};

export const trimEnd = (str: string, suffix: string, ignoreCase = true) => {
  if (endWith(str, suffix, ignoreCase)) {
    return str.substring(0, str.length - suffix.length);
  }

  return str;
};
