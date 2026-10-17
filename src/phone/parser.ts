import { cleanString } from '../common/utils';
import {
  AREA_CODES,
  FIXED_OPERATOR_DIGITS,
  MOBILE_PREFIXES,
  SRI_LANKA_SHORT_CODES,
} from './constants';
import type { PhoneInfo } from './types';

/**
 * Normalizes any Sri Lankan phone number string into a clean 10-digit national number (e.g., '0771234567').
 *
 * @param raw - Phone number in any common format.
 * @returns The national form with a leading 0 and no separators, or `''` if the input contains other characters.
 *
 * @example
 * ```ts
 * normalizePhoneNumber('+94 77 123 4567'); // '0771234567'
 * normalizePhoneNumber('(011) 234-5678'); // '0112345678'
 * ```
 */
export function normalizePhoneNumber(raw: unknown): string {
  let cleaned = cleanString(raw).replace(/[\s\-()./]/g, '');
  if (!/^\+?[0-9]+$/.test(cleaned)) return '';

  if (cleaned.startsWith('+94')) {
    cleaned = '0' + cleaned.slice(3);
  } else if (cleaned.startsWith('0094')) {
    cleaned = '0' + cleaned.slice(4);
  } else if (cleaned.startsWith('94') && cleaned.length === 11) {
    cleaned = '0' + cleaned.slice(2);
  } else if (/^[1-9]\d{8}$/.test(cleaned)) {
    cleaned = '0' + cleaned;
  }

  return cleaned;
}

/**
 * Parses and inspects a Sri Lankan phone number (mobile, landline, or short code).
 * Returns PhoneInfo if valid, or null if invalid.
 *
 * @param rawPhone - Phone number in any common format. Strings and finite numbers are accepted; other types return a failure without throwing.
 * @returns Number type, formats, prefix, area, and originally allocated operator, or `null` if invalid.
 *
 * @example
 * ```ts
 * parsePhone('0771234567')?.type; // 'mobile'
 * parsePhone('0771234567')?.international; // '+94 77 123 4567'
 * parsePhone('0112345678')?.areaName; // 'Colombo'
 * ```
 */
export function parsePhone(rawPhone: unknown): PhoneInfo | null {
  const result = decodePhone(rawPhone);
  return typeof result === 'string' ? null : result;
}

/** Error code for a phone number that is invalid. */
export type PhoneFailureCode = 'PHONE_REQUIRED' | 'PHONE_UNSUPPORTED' | 'PHONE_INVALID';

/**
 * Parses a phone number in a single pass, returning its details or an error code.
 * Shared by `parsePhone` and `validatePhone`; not part of the public API.
 */
export function decodePhone(rawPhone: unknown): PhoneInfo | PhoneFailureCode {
  const raw = cleanString(rawPhone);
  if (!raw) return 'PHONE_REQUIRED';

  // Check short codes first (119, 1990, etc.)
  const digitsOnly = raw;
  const looksLikeShortCode = /^[0-9]{3,4}$/.test(digitsOnly);
  if (looksLikeShortCode && Object.hasOwn(SRI_LANKA_SHORT_CODES, digitsOnly)) {
    return {
      raw,
      normalized: digitsOnly,
      e164: digitsOnly,
      national: digitsOnly,
      international: digitsOnly,
      type: 'short_code',
      operator: 'TRCSL Allocated',
      prefix: digitsOnly,
      areaName: null,
      district: null,
    };
  }

  const normalized = normalizePhoneNumber(raw);

  // Must be 10 digits starting with 0
  if (!/^0\d{9}$/.test(normalized)) {
    return looksLikeShortCode ? 'PHONE_UNSUPPORTED' : 'PHONE_INVALID';
  }

  const prefix3 = normalized.slice(0, 3);
  const subscriberNumber = normalized.slice(3);

  // Check Mobile
  if (MOBILE_PREFIXES[prefix3]) {
    const operator = MOBILE_PREFIXES[prefix3];
    const e164 = `+94${normalized.slice(1)}`;
    const national = `${prefix3} ${subscriberNumber.slice(0, 3)} ${subscriberNumber.slice(3)}`;
    const international = `+94 ${prefix3.slice(1)} ${subscriberNumber.slice(0, 3)} ${subscriberNumber.slice(3)}`;

    return {
      raw,
      normalized,
      e164,
      national,
      international,
      type: 'mobile',
      operator,
      prefix: prefix3,
      areaName: null,
      district: null,
    };
  }

  // Check Landline / Fixed
  if (AREA_CODES[prefix3]) {
    const area = AREA_CODES[prefix3];
    const operatorDigit = subscriberNumber.charAt(0);
    const operator = FIXED_OPERATOR_DIGITS[operatorDigit] ?? 'Fixed Line';
    const e164 = `+94${normalized.slice(1)}`;
    const national = `${prefix3} ${subscriberNumber.slice(0, 3)} ${subscriberNumber.slice(3)}`;
    const international = `+94 ${prefix3.slice(1)} ${subscriberNumber.slice(0, 3)} ${subscriberNumber.slice(3)}`;

    return {
      raw,
      normalized,
      e164,
      national,
      international,
      type: 'fixed',
      operator,
      prefix: prefix3,
      areaName: area.name,
      district: area.district,
    };
  }

  // Toll-free or corporate prefix 0800 / 019
  if (normalized.startsWith('0800') || normalized.startsWith('019')) {
    return {
      raw,
      normalized,
      e164: `+94${normalized.slice(1)}`,
      national: normalized,
      international: `+94 ${normalized.slice(1)}`,
      type: 'toll_free',
      operator: null,
      prefix: prefix3,
      areaName: null,
      district: null,
    };
  }

  return 'PHONE_UNSUPPORTED';
}
