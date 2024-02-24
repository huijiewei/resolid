import { describe, expect, test } from "vitest";
import { hasOwnProperty, isObject } from "./index";

describe("isObject function", () => {
  test("should return true for a non-null object", () => {
    const objectValue = { key: "value" };
    expect(isObject(objectValue)).toBe(true);
  });

  test("should return false for a null value", () => {
    const nullValue = null;
    expect(isObject(nullValue)).toBe(false);
  });

  test("should return false for non-object values", () => {
    const stringValue = "not an object";
    const numberValue = 42;
    const booleanValue = true;

    expect(isObject(stringValue)).toBe(false);
    expect(isObject(numberValue)).toBe(false);
    expect(isObject(booleanValue)).toBe(false);
  });
});

describe("hasOwnProperty function", () => {
  test("should return true for an existing property", () => {
    const objectValue = { key: "value" };
    const prop = "key";

    expect(hasOwnProperty(objectValue, prop)).toBe(true);
  });

  test("should return false for a non-existing property", () => {
    const objectValue = { key: "value" };
    const prop = "nonexistent";

    expect(hasOwnProperty(objectValue, prop)).toBe(false);
  });

  test("should correctly check inherited properties", () => {
    const parentObject = { key: "value" };
    const childObject = Object.create(parentObject);

    const prop = "key";

    expect(hasOwnProperty(childObject, prop)).toBe(false);
  });
});
