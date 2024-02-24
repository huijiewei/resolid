import { describe, expect, test } from 'vitest';
import { clamp, isNumber } from './index';

describe('isNumber function', () => {
  test('should return true for a number', () => {
    const numberValue = 42;
    expect(isNumber(numberValue)).toBe(true);
  });

  test('should return false for a non-number value', () => {
    const stringValue = 'not a number';
    const booleanValue = true;
    const objectValue = { key: 'value' };

    expect(isNumber(stringValue)).toBe(false);
    expect(isNumber(booleanValue)).toBe(false);
    expect(isNumber(objectValue)).toBe(false);
  });
});

describe('clamp function', () => {
  test('should clamp the value within the specified range', () => {
    const value = 5;
    const min = 0;
    const max = 10;

    const clampedValue = clamp(value, [min, max]);

    expect(clampedValue).toBe(value); // Value is already within the range, so it remains unchanged
  });

  test('should clamp the value to the minimum value if it is below the range', () => {
    const value = -5;
    const min = 0;
    const max = 10;

    const clampedValue = clamp(value, [min, max]);

    expect(clampedValue).toBe(min);
  });

  test('should clamp the value to the maximum value if it is above the range', () => {
    const value = 15;
    const min = 0;
    const max = 10;

    const clampedValue = clamp(value, [min, max]);

    expect(clampedValue).toBe(max);
  });
});
