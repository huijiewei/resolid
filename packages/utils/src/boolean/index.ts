export type Booleanish = boolean | "true" | "false";

export const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";
