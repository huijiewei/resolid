export const singleton = <T>(name: string, getValue: () => T): T => {
  const yolo = globalThis as unknown as { __singletons: Map<string, T> };

  yolo.__singletons ??= new Map();

  if (!yolo.__singletons.has(name)) {
    yolo.__singletons.set(name, getValue());
  }

  return yolo.__singletons.get(name) as T;
};
