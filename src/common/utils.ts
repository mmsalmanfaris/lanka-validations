import type { ValidationResult } from './types';

/** Maximum raw scalar string length, in UTF-16 code units, before normalization. */
export const MAX_INPUT_LENGTH = 1024;

/**
 * Trims strings and removes zero-width spaces/BOMs. Accepts finite numbers
 * explicitly; rejects other types without invoking user-defined coercion.
 *
 * @param input - Any value.
 * @returns The trimmed string without zero-width characters, a finite number as text, or `''` for anything else or strings over 1,024 characters.
 *
 * @example
 * ```ts
 * cleanString('  921234567V '); // '921234567V'
 * cleanString(42); // '42'
 * cleanString({}); // ''
 * ```
 */
export function cleanString(input: unknown): string {
  if (typeof input !== 'string') {
    return typeof input === 'number' && Number.isFinite(input) ? String(input) : '';
  }
  if (input.length > MAX_INPUT_LENGTH) return '';
  return input.trim().replace(/[\u200B\uFEFF]/g, '');
}

/**
 * Strips all spaces, hyphens, and standard separators.
 *
 * @param input - Any value.
 * @returns `cleanString(input)` with spaces, hyphens, underscores, slashes, and dots removed.
 *
 * @example
 * ```ts
 * removeSeparators('077-123 4567'); // '0771234567'
 * ```
 */
export function removeSeparators(input: unknown): string {
  return cleanString(input).replace(/[\s\-_/.]/g, '');
}

/**
 * Checks if a given year is a leap year.
 *
 * @param year - Four-digit year.
 * @returns `true` for leap years.
 *
 * @example
 * ```ts
 * isLeapYear(2024); // true
 * isLeapYear(1900); // false
 * ```
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Pads a number with leading zeros to the specified length.
 *
 * @param num - Number to pad.
 * @param length - Minimum length of the result.
 * @returns The number as text, padded with leading zeros.
 *
 * @example
 * ```ts
 * padZero(7, 3); // '007'
 * ```
 */
export function padZero(num: number, length: number): string {
  return num.toString().padStart(length, '0');
}

/**
 * Formats a Date object as YYYY-MM-DD string.
 *
 * @param date - Date to format.
 * @returns The UTC calendar date as `YYYY-MM-DD`.
 *
 * @example
 * ```ts
 * formatIsoDate(new Date(Date.UTC(1992, 4, 2))); // '1992-05-02'
 * ```
 */
export function formatIsoDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = padZero(date.getUTCMonth() + 1, 2);
  const d = padZero(date.getUTCDate(), 2);
  return `${y}-${m}-${d}`;
}

/**
 * Checks if the given year, month (1-12), and day (1-31) represent a valid calendar date.
 *
 * @param year - Year between 1800 and 2200.
 * @param month - Month, 1 to 12.
 * @param day - Day of the month.
 * @returns `true` if the date exists.
 *
 * @example
 * ```ts
 * isValidCalendarDate(2024, 2, 29); // true
 * isValidCalendarDate(2023, 2, 29); // false
 * ```
 */
export function isValidCalendarDate(year: number, month: number, day: number): boolean {
  if (year < 1800 || year > 2200 || month < 1 || month > 12 || day < 1) return false;
  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= daysInMonth[month - 1]!;
}

/**
 * Helper to construct a successful ValidationResult
 *
 * @param data - Parsed value to return.
 * @returns A successful `ValidationResult`.
 *
 * @example
 * ```ts
 * createSuccess(42).isValid; // true
 * ```
 */
export function createSuccess<T>(data: T): ValidationResult<T> {
  return {
    isValid: true,
    data,
  };
}

/**
 * Helper to construct a failed ValidationResult
 *
 * @param error - English error message.
 * @param code - Stable error code. Defaults to `'VALIDATION_FAILED'`.
 * @param errors - All messages. Defaults to `[error]`.
 * @returns A failed `ValidationResult`.
 *
 * @example
 * ```ts
 * createFailure('Too short', 'NAME_TOO_SHORT').code; // 'NAME_TOO_SHORT'
 * ```
 */
export function createFailure<T = unknown>(
  error: string,
  code = 'VALIDATION_FAILED',
  errors?: string[],
): ValidationResult<T> {
  return {
    isValid: false,
    error,
    errors: errors ?? [error],
    code,
  };
}
