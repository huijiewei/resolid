import { act, renderHook } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { useDisclosure } from './index';

describe('useDisclosure', () => {
  test('handles close correctly', () => {
    const { result } = renderHook(() => useDisclosure({ defaultOpened: true }));
    expect(result.current.opened).toBe(true);

    act(() => result.current.close());
    expect(result.current.opened).toBe(false);
  });

  test('handles open correctly', () => {
    const { result } = renderHook(() => useDisclosure({ defaultOpened: false }));
    expect(result.current.opened).toBe(false);

    act(() => result.current.open());
    expect(result.current.opened).toBe(true);
  });

  test('handles toggle correctly', () => {
    const { result } = renderHook(() => useDisclosure({ defaultOpened: false }));
    expect(result.current.opened).toBe(false);

    act(() => result.current.toggle());
    expect(result.current.opened).toBe(true);

    act(() => result.current.toggle());
    expect(result.current.opened).toBe(false);
  });

  test('calls onClose when close is called', () => {
    const onClose = vi.fn();
    const { result } = renderHook(() => useDisclosure({ defaultOpened: true, onClose }));
    expect(onClose).toHaveBeenCalledTimes(0);

    act(() => result.current.close());
    expect(onClose).toHaveBeenCalledTimes(1);

    act(() => result.current.close());
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('calls onOpen when open is called', () => {
    const onOpen = vi.fn();
    const { result } = renderHook(() => useDisclosure({ defaultOpened: false, onOpen }));
    expect(onOpen).toHaveBeenCalledTimes(0);

    act(() => result.current.open());
    expect(onOpen).toHaveBeenCalledTimes(1);

    act(() => result.current.open());
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  test('calls onOpen and onClose correctly when toggle is called', () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();
    const { result } = renderHook(() => useDisclosure({ defaultOpened: false, onOpen, onClose }));
    expect(onOpen).toHaveBeenCalledTimes(0);
    expect(onClose).toHaveBeenCalledTimes(0);

    act(() => result.current.toggle());
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(0);

    act(() => result.current.toggle());
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);

    act(() => result.current.toggle());
    expect(onOpen).toHaveBeenCalledTimes(2);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
