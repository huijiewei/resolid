export const wait = (delay: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

export const to = async <T, E = Error>(promise: Promise<T>): Promise<[E, undefined] | [undefined, T]> => {
  return promise
    .then<[undefined, T]>((data) => [undefined, data])
    .catch<[E, undefined]>((error: E) => [error, undefined]);
};

export const debounce = (fn: () => void, delay: number): (() => void) => {
  let timeoutId: NodeJS.Timeout;
  let invoked = false;

  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (!invoked) {
      fn();
      // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
      (invoked = true) && setTimeout(() => (invoked = false), delay);
    } else {
      timeoutId = setTimeout(fn, delay);
    }
  };
};
