import { describe, expect, test } from "vitest";
import { isFunction, type AnyFunction } from "./index";

describe("isFunction function", () => {
  test("should return true for a function", () => {
    const fn: AnyFunction = () => "Hello";
    expect(isFunction(fn)).toBe(true);
  });

  test("should return false for a non-function value", () => {
    const nonFunctionValue = "not a function";
    expect(isFunction(nonFunctionValue)).toBe(false);
  });
});
