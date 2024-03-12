import { describe, expect, test } from "vitest";
import { isBoolean } from "./index";

describe("isBoolean function", () => {
  test("should return true for a boolean value", () => {
    const booleanValue = true;
    expect(isBoolean(booleanValue)).toBe(true);
  });

  test('should return false for a string "true"', () => {
    const stringValue = "true";
    expect(isBoolean(stringValue)).toBe(false);
  });

  test('should return false for a string "false"', () => {
    const stringValue = "false";
    expect(isBoolean(stringValue)).toBe(false);
  });

  test("should return false for other non-boolean values", () => {
    const numberValue = 42;
    const stringValue = "not a boolean";
    const objectValue = { key: "value" };

    expect(isBoolean(numberValue)).toBe(false);
    expect(isBoolean(stringValue)).toBe(false);
    expect(isBoolean(objectValue)).toBe(false);
  });
});
