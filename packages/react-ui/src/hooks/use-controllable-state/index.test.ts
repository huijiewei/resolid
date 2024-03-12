import { act, renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { useControllableState } from "./index";

describe("useControllableState", () => {
  test("should be uncontrolled when defaultValue is passed", () => {
    const { result } = renderHook(() => useControllableState({ defaultValue: "testing" }));
    const [value] = result.current;
    expect(value).toBe("testing");

    act(() => {
      const [, setValue] = result.current;
      setValue("naruto");
    });

    const [next] = result.current;
    expect(next).toBe("naruto");
  });

  test("should be controlled when value is passed", () => {
    const { result } = renderHook(() => useControllableState({ value: "testing" }));
    const [value] = result.current;
    expect(value).toBe("testing");

    act(() => {
      const [, setValue] = result.current;
      setValue("naruto");
    });

    const [next] = result.current;
    expect(next).toBe("testing");
  });
});
