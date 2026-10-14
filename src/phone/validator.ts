import { cleanString, createFailure, createSuccess } from '../common/utils';
import type { ValidationResult } from '../common/types';
import { normalizePhoneNumber, parsePhone } from './parser';
import type { PhoneInfo } from './types';

/**
 * Validates any Sri Lankan telephone number (mobile, landline, or recognized short code).
 *
 * @param phone - Phone number in any common format, for example `'077 123 4567'` or `'+94771234567'`. Strings and finite numbers are accepted; other types return a failure without throwing.
 * @returns `true` for a valid mobile, fixed-line, toll-free number, or public short code.
 *
 * @example
 * ```ts
 * isValidPhone('0771234567'); // true
 * isValidPhone('+94 11 234 5678'); // true
 * isValidPhone('119'); // true
 * isValidPhone('12345'); // false
 * ```
 */
export function isValidPhone(phone: unknown): boolean {
  return parsePhone(phone) !== null;
}

/**
 *  Validates a full contact number, excluding service and emergency short codes.
 *
 * @param phone - Phone number to check.
 * @returns `true` for a full phone number a person can be reached on; short codes return `false`.
 *
 * @example
 * ```ts
 * isValidContactPhone('0771234567'); // true
 * isValidContactPhone('119'); // false
 * ```
 */
export function isValidContactPhone(phone: unknown): boolean {
  const info = parsePhone(phone);
  return info !== null && info.type !== 'short_code';
}

/**
 * Validates whether the input is a valid Sri Lankan mobile phone number (Dialog, Mobitel, Hutch, Airtel).
 *
 * @param phone - Phone number to check.
 * @returns `true` only for Sri Lankan mobile numbers.
 *
 * @example
 * ```ts
 * isValidMobile('077 123 4567'); // true
 * isValidMobile('0112345678'); // false
 * ```
 */
export function isValidMobile(phone: unknown): boolean {
  const info = parsePhone(phone);
  return info !== null && info.type === 'mobile';
}

/**
 * Validates whether the input is a valid Sri Lankan fixed/landline phone number.
 *
 * @param phone - Phone number to check.
 * @returns `true` only for fixed-line numbers with a known area code.
 *
 * @example
 * ```ts
 * isValidLandline('0112345678'); // true
 * isValidLandline('0771234567'); // false
 * ```
 */
export function isValidLandline(phone: unknown): boolean {
  const info = parsePhone(phone);
  return info !== null && info.type === 'fixed';
}

/**
 * Validates whether the input is an official Sri Lankan emergency or government short code.
 *
 * @param code - Short code to check, such as `'119'`.
 * @returns `true` for a known public service or emergency short code.
 *
 * @example
 * ```ts
 * isValidShortCode('119'); // true
 * isValidShortCode('999'); // false
 * ```
 */
export function isValidShortCode(code: unknown): boolean {
  const info = parsePhone(code);
  return info !== null && info.type === 'short_code';
}

/**
 * Detailed validation returning structured ValidationResult with error code and messages.
 *
 * @param phone - Phone number in any common format. Strings and finite numbers are accepted; other types return a failure without throwing.
 * @returns `{ isValid: true, data }` with `PhoneInfo`, or `{ isValid: false, error, errors, code }`.
 *
 * @example
 * ```ts
 * validatePhone('0771234567').isValid; // true
 * validatePhone('12345').isValid; // false
 * ```
 */
export function validatePhone(phone: unknown): ValidationResult<PhoneInfo> {
  const info = parsePhone(phone);
  if (info) return createSuccess(info);

  if (!cleanString(phone)) {
    return createFailure('Phone number is required.', 'PHONE_REQUIRED');
  }

  const cleaned = cleanString(phone);
  const normalized = normalizePhoneNumber(cleaned);
  if (/^0[0-9]{9}$/.test(normalized) || /^[0-9]{3,4}$/.test(cleaned)) {
    return createFailure(
      'Phone number prefix or short code is not in the bundled reference data.',
      'PHONE_UNSUPPORTED',
    );
  }
  return createFailure('Invalid Sri Lankan phone number format.', 'PHONE_INVALID');
}
