import { cleanString, createFailure, createSuccess } from '../common/utils';
import type { ValidationResult } from '../common/types';
import { parsePassport } from './parser';
import type { PassportInfo } from './types';

/**
 * Validates whether the input is a valid Sri Lankan passport number.
 *
 * @param passport - Passport number to check.
 * @returns `true` if the number matches a Sri Lankan passport format. Issuance is not verified.
 *
 * @example
 * ```ts
 * isValidPassport('N1234567'); // true
 * isValidPassport('1234567'); // false
 * ```
 */
export function isValidPassport(passport: unknown): boolean {
  return parsePassport(passport) !== null;
}

/**
 * Validates a Sri Lankan passport number returning detailed ValidationResult.
 *
 * @param passport - Passport number to check.
 * @returns `{ isValid: true, data }` with `PassportInfo`, or `{ isValid: false, error, errors, code }`.
 *
 * @example
 * ```ts
 * validatePassport('N1234567').isValid; // true
 * ```
 */
export function validatePassport(passport: unknown): ValidationResult<PassportInfo> {
  const cleaned = cleanString(passport);
  if (!cleaned) {
    return createFailure('Passport number is required.', 'PASSPORT_REQUIRED');
  }

  const info = parsePassport(cleaned);
  if (!info) {
    return createFailure(
      'Invalid Sri Lankan passport number. Example format: N1234567 or P1234567.',
      'PASSPORT_INVALID',
    );
  }

  return createSuccess(info);
}
