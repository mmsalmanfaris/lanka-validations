import { cleanString, createFailure, createSuccess, padZero } from '../common/utils';
import type { ValidationResult } from '../common/types';
import { MAJOR_CITIES, POSTAL_PREFIXES } from './data';
import type { PostalCodeInfo } from './types';

/**
 * Normalizes a postal code into a 5-digit string (e.g. 100 -> '00100').
 */
export function normalizePostalCode(input: unknown): string | null {
  if (typeof input === 'number') {
    if (!Number.isInteger(input) || input < 0 || input > 99999) return null;
    return padZero(input, 5);
  }

  const cleaned = cleanString(input);
  if (!/^[0-9]{1,5}$/.test(cleaned)) return null;

  if (cleaned.length <= 5) {
    return cleaned.padStart(5, '0');
  }

  return null;
}

/**
 * Looks up district, province, and primary city for a Sri Lankan 5-digit postal code.
 * Returns PostalCodeInfo or null if not a recognized postal code range.
 */
export function lookupPostalCode(code: unknown): PostalCodeInfo | null {
  const normalized = normalizePostalCode(code);
  if (!normalized) return null;

  const prefix = normalized.slice(0, 2);
  const mapping = POSTAL_PREFIXES[prefix];
  if (!mapping) return null;

  const primaryCity = MAJOR_CITIES[normalized];

  return {
    code: normalized,
    district: mapping.district,
    province: mapping.province,
    primaryCity,
  };
}

/**
 * Validates whether the given code is a valid 5-digit Sri Lankan postal code.
 */
export function isValidPostalCode(code: unknown): boolean {
  return lookupPostalCode(code) !== null;
}

/**
 * Validates a Sri Lankan postal code returning detailed ValidationResult.
 */
export function validatePostalCode(code: unknown): ValidationResult<PostalCodeInfo> {
  const normalized = normalizePostalCode(code);
  if (!normalized) {
    return createFailure(
      'Invalid postal code format. Expected a 5-digit code (e.g. "00100", "20000").',
      'POSTAL_CODE_INVALID_FORMAT',
    );
  }

  const info = lookupPostalCode(normalized);
  if (!info) {
    return createFailure(
      'Postal code is not within the bundled Sri Lankan postal district ranges.',
      'POSTAL_CODE_OUT_OF_RANGE',
    );
  }

  return createSuccess(info);
}
