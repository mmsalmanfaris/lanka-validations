import { cleanString, createFailure, createSuccess } from '../common/utils';
import type { ValidationResult } from '../common/types';

const TIN_PATTERN = /^\d{9,10}$/;

/**
 * Validates the format of a Sri Lankan Taxpayer Identification Number (TIN) issued by IRD.
 * Accepts 9 or 10 digits. An NIC number is not a TIN: individuals register for a TIN
 * using their NIC, and IRD issues a separate number.
 *
 * @param tin - Taxpayer Identification Number. Spaces and hyphens are ignored.
 * @returns `true` for 9 or 10 digits. NIC numbers return `false`.
 *
 * @example
 * ```ts
 * isValidTIN('123456789'); // true
 * isValidTIN('921234567V'); // false
 * ```
 */
export function isValidTIN(tin: unknown): boolean {
  return TIN_PATTERN.test(cleanString(tin).replace(/[\s-]/g, ''));
}

/**
 * Validates a Sri Lankan VAT Registration Number issued by IRD.
 * Formats: 9 digits + optional '-7000' suffix (e.g. '123456789-7000' or '1234567897000') or 12 digits.
 *
 * @param vat - VAT registration number.
 * @returns `true` for a recognised VAT number format.
 *
 * @example
 * ```ts
 * isValidVAT('123456789-7000'); // true
 * isValidVAT('invalid'); // false
 * ```
 */
export function isValidVAT(vat: unknown): boolean {
  return isVatFormat(cleanString(vat).replace(/\s/g, ''));
}

function isVatFormat(cleaned: string): boolean {
  // 9 digits followed by -7000
  if (/^\d{9}-7000$/.test(cleaned)) {
    return true;
  }

  const digits = cleaned.replace(/-/g, '');
  // 9 digits, 12 digits, or 13 digits ending in 7000
  if (/^\d{9}$/.test(digits) || /^\d{12}$/.test(digits) || /^\d{9}7000$/.test(digits)) {
    return true;
  }

  return false;
}

/**
 * Validates a TIN returning detailed ValidationResult.
 *
 * @param tin - Taxpayer Identification Number.
 * @returns `{ isValid: true, data }` with the TIN without separators, or `{ isValid: false, error, errors, code }`.
 *
 * @example
 * ```ts
 * validateTIN('123-456-789').isValid; // true
 * ```
 */
export function validateTIN(tin: unknown): ValidationResult<string> {
  const cleaned = cleanString(tin);
  if (!cleaned) {
    return createFailure('TIN is required.', 'TIN_REQUIRED');
  }

  const digits = cleaned.replace(/[\s-]/g, '');
  if (!TIN_PATTERN.test(digits)) {
    return createFailure(
      'Invalid Sri Lankan Taxpayer Identification Number (TIN). Expected 9-10 digits.',
      'TIN_INVALID',
    );
  }

  return createSuccess(digits);
}

/**
 * Validates a VAT registration number returning detailed ValidationResult.
 *
 * @param vat - VAT registration number.
 * @returns `{ isValid: true, data }` with the VAT number, or `{ isValid: false, error, errors, code }`.
 *
 * @example
 * ```ts
 * validateVAT('123456789-7000').isValid; // true
 * ```
 */
export function validateVAT(vat: unknown): ValidationResult<string> {
  const cleaned = cleanString(vat);
  if (!cleaned) {
    return createFailure('VAT number is required.', 'VAT_REQUIRED');
  }

  if (!isVatFormat(cleaned.replace(/\s/g, ''))) {
    return createFailure(
      'Invalid Sri Lankan VAT number. Expected format: 9 digits (e.g. "123456789-7000").',
      'VAT_INVALID',
    );
  }

  return createSuccess(cleaned);
}
