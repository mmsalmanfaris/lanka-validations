import { describe, expect, it } from 'vitest';
import {
  cleanString,
  isValidCalendarDate,
  MAX_INPUT_LENGTH,
  removeSeparators,
} from '../src/common/utils';

describe('common utilities', () => {
  it('removeSeparators strips spaces, hyphens, underscores, slashes and dots', () => {
    expect(removeSeparators(' 077-123 45_67/8.9 ')).toBe('077123456789');
    expect(removeSeparators(1234)).toBe('1234');
    expect(removeSeparators({})).toBe('');
  });

  it('cleanString rejects oversized strings and removes zero-width characters', () => {
    expect(cleanString('a'.repeat(MAX_INPUT_LENGTH + 1))).toBe('');
    expect(cleanString('\uFEFF12\u200B3 ')).toBe('123');
    expect(cleanString(Number.NaN)).toBe('');
  });

  it('isValidCalendarDate accepts real dates, including leap days', () => {
    expect(isValidCalendarDate(2024, 2, 29)).toBe(true);
    expect(isValidCalendarDate(2000, 2, 29)).toBe(true);
    expect(isValidCalendarDate(2023, 12, 31)).toBe(true);
  });

  it.each([
    [2023, 2, 29],
    [1900, 2, 29],
    [2023, 4, 31],
    [2023, 13, 1],
    [2023, 0, 1],
    [2023, 1, 0],
    [1799, 1, 1],
    [2201, 1, 1],
  ])('isValidCalendarDate rejects %i-%i-%i', (year, month, day) => {
    expect(isValidCalendarDate(year, month, day)).toBe(false);
  });
});
