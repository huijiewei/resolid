import { describe, expect, test } from "vitest";
import { isFunction, runIfFunction, type AnyFunction } from "./index";

describe("isFunction function", () => {
  test("should return true for a function", () => {
    const fn = () => "Hello";
    expect(isFunction(fn)).toBe(true);
  });

  test("should return false for a non-function value", () => {
    const nonFunctionValue = "not a function";
    expect(isFunction(nonFunctionValue)).toBe(false);
  });
});

describe("runMaybeFunction function", () => {
  test("should run the function and return the result", () => {
    const fn: AnyFunction<number, number> = (x) => x * 2;
    const result = runIfFunction(fn, 5);
    expect(result).toBe(10);
  });

  test("should return the value if it is not a function", () => {
    const value = "not a function";
    const result = runIfFunction(value);
    expect(result).toBe(value);
  });
});
