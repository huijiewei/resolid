// @vitest-environment jsdom

import { describe, expect, test } from "vitest";
import { isBrowser } from "./index";

describe("isBrowser function", () => {
  test("should return true in a browser environment", () => {
    expect(isBrowser()).toBe(true);
  });

  test("should return false in a non-browser environment", () => {
    // @ts-expect-error Type undefined is not assignable to type Window
    global.window = undefined;
    expect(isBrowser()).toBe(false);
  });
});
