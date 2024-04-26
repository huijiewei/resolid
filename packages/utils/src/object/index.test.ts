import { describe, expect, test } from "vitest";
// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import { hasOwnProperty, isObject, omit } from "./index";

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

describe("omit function", () => {
  test("should omit specified keys from an object", () => {
    const originalObject = { a: 1, b: 2, c: 3 };

    const resultObject = omit(originalObject, ["b"]);

    expect(resultObject).toEqual({ a: 1, c: 3 });
  });
});
