import { createFailure, createSuccess } from '../common/utils';
import type { ValidationResult } from '../common/types';
import { decodeNic, parseNic } from './parser';
import type { NicInfo, NicOptions } from './types';

/**
 * Checks whether an input string is a valid Sri Lankan NIC (old or new format).
 *
 * @param nic - NIC number, old (9 digits + V/X) or new (12 digits). Strings and finite numbers are accepted; other types return a failure without throwing.
 * @param options - Optional `{ referenceDate }` used for age and future-date checks. Defaults to today.
 * @returns `true` for a valid old- or new-format NIC, otherwise `false`.
 *
 * @example
 * ```ts
 * isValidNic('921234567V'); // true
 * isValidNic('199212304567'); // true
 * isValidNic('9212345678'); // false
 * ```
 */
export function isValidNic(nic: unknown, options?: NicOptions): boolean {
  return parseNic(nic, options) !== null;
}

/**
 * Checks specifically whether an input is a valid 10-character Old NIC (9 digits + V/X).
 *
 * @param nic - NIC number to check.
 * @param options - Optional `{ referenceDate }` used for age and future-date checks. Defaults to today.
 * @returns `true` only for a valid old-format NIC (9 digits followed by V or X).
 *
 * @example
 * ```ts
 * isValidOldNic('921234567V'); // true
 * isValidOldNic('199212304567'); // false
 * ```
 */
export function isValidOldNic(nic: unknown, options?: NicOptions): boolean {
  const info = parseNic(nic, options);
  return info !== null && info.format === 'old';
}

/**
 * Checks specifically whether an input is a valid 12-digit New NIC.
 *
 * @param nic - NIC number to check.
 * @param options - Optional `{ referenceDate }` used for age and future-date checks. Defaults to today.
 * @returns `true` only for a valid new-format NIC (12 digits).
 *
 * @example
 * ```ts
 * isValidNewNic('199212304567'); // true
 * isValidNewNic('921234567V'); // false
 * ```
 */
export function isValidNewNic(nic: unknown, options?: NicOptions): boolean {
  const info = parseNic(nic, options);
  return info !== null && info.format === 'new';
}

/**
 * Comprehensive NIC validation returning structured ValidationResult with error messages and codes.
 *
 * @param rawNic - NIC number, old or new format. Strings and finite numbers are accepted; other types return a failure without throwing.
 * @param options - Optional `{ referenceDate }` used for age and future-date checks. Defaults to today.
 * @returns `{ isValid: true, data }` with `NicInfo`, or `{ isValid: false, error, errors, code }`.
 *
 * @example
 * ```ts
 * validateNic('921234567V').isValid; // true
 * validateNic('92123456').code; // 'NIC_INVALID_FORMAT'
 * ```
 */
export function validateNic(rawNic: unknown, options?: NicOptions): ValidationResult<NicInfo> {
  const result = decodeNic(rawNic, options);
  if (!('code' in result)) return createSuccess(result);

  switch (result.code) {
    case 'NIC_REQUIRED':
      return createFailure('NIC number is required', result.code);
    case 'NIC_INVALID_FORMAT':
      return createFailure(
        'Invalid NIC format. Must be 9 digits followed by V/X or 12 digits.',
        result.code,
      );
    case 'NIC_INVALID_OPTIONS':
      return createFailure('Invalid NIC reference date.', result.code);
    case 'NIC_INVALID_YEAR':
      return createFailure(
        `Invalid birth year in NIC: ${result.year}. Must be between 1850 and ${result.currentYear}.`,
        result.code,
      );
    case 'NIC_INVALID_DAY':
      return createFailure(
        `Invalid day of year in NIC: ${result.rawDays}. Must be 001-366 (male) or 501-866 (female).`,
        result.code,
      );
    case 'NIC_FUTURE_DOB':
      return createFailure('Date of birth encoded in NIC is in the future.', result.code);
  }
}
