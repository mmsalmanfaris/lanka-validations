import type { ValidationResult } from './types';

/**
 * Trims strings and removes zero-width spaces/BOMs. Accepts finite numbers
 * explicitly; rejects other types without invoking user-defined coercion.
 */
export function cleanString(input: unknown): string {
  if (typeof input !== 'string') {
    return typeof input === 'number' && Number.isFinite(input) ? String(input) : '';
  }
  return input.trim().replace(/[\u200B\uFEFF]/g, '');
}

/**
 * Strips all spaces, hyphens, and standard separators.
 */
export function removeSeparators(input: unknown): string {
  return cleanString(input).replace(/[\s\-_/.]/g, '');
}

/**
 * Checks if a given year is a leap year.
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Pads a number with leading zeros to the specified length.
 */
export function padZero(num: number, length: number): string {
  return num.toString().padStart(length, '0');
}

/**
 * Formats a Date object as YYYY-MM-DD string.
 */
export function formatIsoDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = padZero(date.getUTCMonth() + 1, 2);
  const d = padZero(date.getUTCDate(), 2);
  return `${y}-${m}-${d}`;
}

/**
 * Checks if the given year, month (1-12), and day (1-31) represent a valid calendar date.
 */
export function isValidCalendarDate(year: number, month: number, day: number): boolean {
  if (year < 1800 || year > 2200 || month < 1 || month > 12 || day < 1) return false;
  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= daysInMonth[month - 1];
}

/**
 * Helper to construct a successful ValidationResult
 */
export function createSuccess<T>(data: T): ValidationResult<T> {
  return {
    isValid: true,
    data,
  };
}

/**
 * Helper to construct a failed ValidationResult
 */
export function createFailure<T = unknown>(
  error: string,
  code?: string,
  errors?: string[]
): ValidationResult<T> {
  return {
    isValid: false,
    error,
    errors: errors ?? [error],
    code,
  };
}
