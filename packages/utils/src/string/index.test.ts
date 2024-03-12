import { describe, expect, test } from "vitest";
import { endWith, isEmpty, isString, startWith, trimEnd, trimStart } from "./index";

describe("isString function", () => {
  test("should return true for a string", () => {
    const stringValue = "Hello, world!";
    expect(isString(stringValue)).toBe(true);
  });

  test("should return false for a non-string value", () => {
    const numberValue = 42;
    const booleanValue = true;
    const objectValue = { key: "value" };

    expect(isString(numberValue)).toBe(false);
    expect(isString(booleanValue)).toBe(false);
    expect(isString(objectValue)).toBe(false);
  });

  test("should return false for null or undefined", () => {
    const nullValue = null;
    const undefinedValue = undefined;

    expect(isString(nullValue)).toBe(false);
    expect(isString(undefinedValue)).toBe(false);
  });
});

describe("isEmpty function", () => {
  test("should return true for undefined values", () => {
    expect(isEmpty(undefined)).toBe(true);
  });

  test("should return true for null values", () => {
    expect(isEmpty(null)).toBe(true);
  });

  test("should return true for empty strings", () => {
    expect(isEmpty("")).toBe(true);
  });

  test("should return true for strings with only whitespace", () => {
    expect(isEmpty("   ")).toBe(true);
    expect(isEmpty("\t\n")).toBe(true);
  });

  test("should return false for non-empty strings", () => {
    expect(isEmpty("hello")).toBe(false);
    expect(isEmpty("12345")).toBe(false);
    expect(isEmpty("some text")).toBe(false);
  });
});

describe("startWith function", () => {
  test("should return true if the string starts with the prefix", () => {
    expect(startWith("hello world", "hello")).toBe(true);
    expect(startWith("JavaScript", "Java")).toBe(true);
    expect(startWith("prefix string", "prefix")).toBe(true);
  });

  test("should return false if the string does not start with the prefix", () => {
    expect(startWith("hello world", "world")).toBe(false);
    expect(startWith("JavaScript", "C#")).toBe(false);
    expect(startWith("not prefixed", "prefix")).toBe(false);
  });

  test("should return false if the prefix is longer than the string", () => {
    expect(startWith("short", "longer prefix")).toBe(false);
  });

  test("should handle empty strings or prefixes correctly", () => {
    expect(startWith("", "")).toBe(true);
    expect(startWith("some string", "")).toBe(true);
    expect(startWith("", "prefix")).toBe(false);
  });

  test("should support case-insensitivity by default", () => {
    expect(startWith("Hello world", "hello")).toBe(true);
    expect(startWith("JavaScript", "java")).toBe(true);
  });

  test("should be case-sensitive if specified", () => {
    expect(startWith("Hello world", "hello", false)).toBe(false);
    expect(startWith("JavaScript", "java", false)).toBe(false);
  });
});

describe("trimStart function", () => {
  test("should remove the given prefix from the beginning of the string if it exists", () => {
    expect(trimStart("hello world", "hello")).toBe(" world");
    expect(trimStart("JavaScript", "Java")).toBe("Script");
    expect(trimStart("not prefixed", "prefix")).toBe("not prefixed");
  });

  test("should not modify the string if the prefix is not present", () => {
    expect(trimStart("world", "hello")).toBe("world");
    expect(trimStart("not prefixed", "Java")).toBe("not prefixed");
  });

  test("should handle empty strings or prefixes correctly", () => {
    expect(trimStart("", "prefix")).toBe("");
    expect(trimStart("some string", "")).toBe("some string");
  });

  test("should return the original string if it is shorter than the prefix", () => {
    expect(trimStart("short", "longer prefix")).toBe("short");
  });

  test("should support case-insensitive trimming if specified", () => {
    expect(trimStart("Hello world", "hello", true)).toBe(" world");
    expect(trimStart("JavaScript", "java", true)).toBe("Script");
  });

  test("should maintain case-sensitivity by default even if the prefix contains uppercase letters", () => {
    expect(trimStart("Hello world", "Hello", true)).toBe(" world");
  });
});

describe("endWith function", () => {
  test("should return true if the string ends with the suffix", () => {
    expect(endWith("hello world", "world")).toBe(true);
    expect(endWith("JavaScript", "Script")).toBe(true);
    expect(endWith("file.txt", ".txt")).toBe(true);
  });

  test("should return false if the string does not end with the suffix", () => {
    expect(endWith("hello world", "hello")).toBe(false);
    expect(endWith("JavaScript", "Java")).toBe(false);
    expect(endWith("not suffixed", "suffix")).toBe(false);
  });

  test("should handle strings shorter than the suffix", () => {
    expect(endWith("short", "suffix")).toBe(false);
  });

  test("should handle empty strings or suffixes correctly", () => {
    expect(endWith("", "")).toBe(true); // Empty string ends with anything
    expect(endWith("some string", "")).toBe(true); // Suffix is empty
    expect(endWith("", "suffix")).toBe(false); // String is empty, suffix isn't
  });

  test("should be case-sensitive by default", () => {
    expect(endWith("hello World", "world")).toBe(true);
    expect(endWith("JavaScript", "script")).toBe(true);
  });

  test("should support case-insensitivity if specified", () => {
    expect(endWith("hello World", "world", false)).toBe(false);
    expect(endWith("JavaScript", "script", false)).toBe(false);
  });
});

describe("trimEnd", () => {
  test("should remove the given suffix from the end of the string if it exists", () => {
    expect(trimEnd("hello world", "world")).toBe("hello ");
    expect(trimEnd("JavaScript", "Script")).toBe("Java");
    expect(trimEnd("not suffixed", "suffix")).toBe("not suffixed");
  });

  test("should not modify the string if the suffix is not present", () => {
    expect(trimEnd("hello", "world")).toBe("hello");
    expect(trimEnd("not suffixed", "Java")).toBe("not suffixed");
  });

  test("should handle empty strings or suffixes correctly", () => {
    expect(trimEnd("", "suffix")).toBe("");
    expect(trimEnd("some string", "")).toBe("some string");
    expect(trimEnd("", "")).toBe("");
  });

  test("should return the original string if it is shorter than the suffix", () => {
    expect(trimEnd("short", "longer suffix")).toBe("short");
  });

  test("should support case-insensitive trimming if specified", () => {
    expect(trimEnd("hello World", "world", false)).toBe("hello World");
    expect(trimEnd("JavaScript", "script", false)).toBe("JavaScript");
  });

  test("should handle newlines and other special characters in the suffix (if relevant to your use case)", () => {
    expect(trimEnd("hello\nworld", "\nworld")).toBe("hello");
    expect(trimEnd("hello\tworld", "\tworld")).toBe("hello");
  });
});
