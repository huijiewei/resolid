import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { debounce, to, wait } from "./index";

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

describe("debounce function", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("should debounce function calls", () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    vi.advanceTimersByTime(50);

    debouncedFn();

    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(2);
  });
});
