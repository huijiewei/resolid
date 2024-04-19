import { act, renderHook } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { useDisclosure } from "./index";

describe("useDisclosure", () => {
  test("handles close correctly", () => {
    const { result } = renderHook(() => useDisclosure({ defaultOpened: true }));

    const [opened, { close }] = result.current;
    expect(opened).toBe(true);

    act(close);

    const [next] = result.current;

    expect(next).toBe(false);
  });

  test("handles open correctly", () => {
    const { result } = renderHook(() => useDisclosure({ defaultOpened: false }));

    const [opened, { open }] = result.current;
    expect(opened).toBe(false);

    act(open);

    const [next] = result.current;
    expect(next).toBe(true);
  });

  test("handles toggle correctly", () => {
    const { result } = renderHook(() => useDisclosure({ defaultOpened: false }));

    const [opened, { toggle }] = result.current;
    expect(opened).toBe(false);

    act(toggle);

    const [next] = result.current;
    expect(next).toBe(true);

    act(() => {
      const [, { toggle }] = result.current;
      toggle();
    });

    const [last] = result.current;
    expect(last).toBe(false);
  });

  test("calls onClose when close is called", () => {
    const onClose = vi.fn();
    const { result } = renderHook(() => useDisclosure({ defaultOpened: true, onClose }));
    expect(onClose).toHaveBeenCalledTimes(0);

    act(() => {
      const [, { close }] = result.current;
      close();
    });
    expect(onClose).toHaveBeenCalledTimes(1);

    act(() => {
      const [, { close }] = result.current;
      close();
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("calls onOpen when open is called", () => {
    const onOpen = vi.fn();
    const { result } = renderHook(() => useDisclosure({ defaultOpened: false, onOpen }));
    expect(onOpen).toHaveBeenCalledTimes(0);

    act(() => {
      const [, { open }] = result.current;
      open();
    });
    expect(onOpen).toHaveBeenCalledTimes(1);

    act(() => {
      const [, { open }] = result.current;
      open();
    });
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  test("calls onOpen and onClose correctly when toggle is called", () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();
    const { result } = renderHook(() => useDisclosure({ defaultOpened: false, onOpen, onClose }));
    expect(onOpen).toHaveBeenCalledTimes(0);
    expect(onClose).toHaveBeenCalledTimes(0);

    act(() => {
      const [, { toggle }] = result.current;
      toggle();
    });
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(0);

    act(() => {
      const [, { toggle }] = result.current;
      toggle();
    });
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);

    act(() => {
      const [, { toggle }] = result.current;
      toggle();
    });
    expect(onOpen).toHaveBeenCalledTimes(2);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
