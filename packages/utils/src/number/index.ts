export const isNumber = (value: unknown): value is number => typeof value === "number";

export const clamp = (value: number, [min, max]: [number, number]): number => {
  return Math.min(max, Math.max(min, value));
};
