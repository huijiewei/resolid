import { describe, expect, test } from "vitest";
import { to, wait } from "./index";

describe("wait function", () => {
  test("should resolve after the specified delay", async () => {
    const start = performance.now();
    await wait(20);
    expect(performance.now() - start).toBeGreaterThanOrEqual(19);
  });
});

describe("to function", () => {
  test("should resolve with [null, data] for a successful promise", async () => {
    const testData = "Hello, world!";
    const promise = Promise.resolve(testData);

    const result = await to(promise);

    expect(result).toEqual([null, testData]);
  });

  test("should resolve with [error, undefined] for a rejected promise", async () => {
    const testError = new Error("Test error");
    const promise = Promise.reject(testError);

    const result = await to(promise);

    expect(result).toEqual([testError, undefined]);
  });
});
