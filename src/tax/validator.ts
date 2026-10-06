import { cleanString, createFailure, createSuccess } from '../common/utils';
import type { ValidationResult } from '../common/types';
import { isValidNic } from '../nic/validator';

/**
 * Validates a Sri Lankan Taxpayer Identification Number (TIN) issued by IRD.
 * Accepts: 9 digits, 10 digits, or valid individual NIC.
 */
export function isValidTIN(tin: unknown): boolean {
  const cleaned = cleanString(tin).replace(/[\s\-]/g, '');
  if (!cleaned) return false;

  // 9-digit or 10-digit TIN
  if (/^\d{9,10}$/.test(cleaned)) {
    return true;
  }

  // IRD also designates individual NIC as TIN
  if (isValidNic(cleaned)) {
    return true;
  }

  return false;
}

/**
 * Validates a Sri Lankan VAT Registration Number issued by IRD.
 * Formats: 9 digits + optional '-7000' suffix (e.g. '123456789-7000' or '1234567897000') or 12 digits.
 */
export function isValidVAT(vat: unknown): boolean {
  const cleaned = cleanString(vat).replace(/\s/g, '');
  if (!cleaned) return false;

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
 */
export function validateTIN(tin: unknown): ValidationResult<string> {
  const cleaned = cleanString(tin);
  if (!cleaned) {
    return createFailure('TIN is required.', 'TIN_REQUIRED');
  }

  if (!isValidTIN(cleaned)) {
    return createFailure(
      'Invalid Sri Lankan Taxpayer Identification Number (TIN). Expected 9-10 digits or valid NIC.',
      'TIN_INVALID'
    );
  }

  return createSuccess(cleaned.replace(/[\s\-]/g, ''));
}

/**
 * Validates a VAT registration number returning detailed ValidationResult.
 */
export function validateVAT(vat: unknown): ValidationResult<string> {
  const cleaned = cleanString(vat);
  if (!cleaned) {
    return createFailure('VAT number is required.', 'VAT_REQUIRED');
  }

  if (!isValidVAT(cleaned)) {
    return createFailure(
      'Invalid Sri Lankan VAT number. Expected format: 9 digits (e.g. "123456789-7000").',
      'VAT_INVALID'
    );
  }

  return createSuccess(cleaned);
}

