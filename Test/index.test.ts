import { add } from '../src/index';
import { describe, it, expect } from '@jest/globals';

describe('add function', () => {
  it('should add two positive numbers correctly', () => {
    expect(add(1, 2)).toBe(3);
  });

  it('should add two negative numbers correctly', () => {
    expect(add(-1, -2)).toBe(-3);
  });

  it('should add a positive and a negative number correctly', () => {
    expect(add(1, -2)).toBe(-1);
  });

  it('should add zero correctly', () => {
    expect(add(0, 0)).toBe(0);
    expect(add(1, 0)).toBe(1);
    expect(add(0, 1)).toBe(1);
  });

  it('should handle large numbers correctly', () => {
    expect(add(1000000, 2000000)).toBe(3000000);
  });
});