import { cleanString, createFailure, createSuccess } from '../common/utils';
import type { ValidationResult } from '../common/types';
import { parsePhone } from './parser';
import type { PhoneInfo } from './types';

/**
 * Validates any Sri Lankan telephone number (mobile, landline, or recognized short code).
 */
export function isValidPhone(phone: unknown): boolean {
  return parsePhone(phone) !== null;
}

/** Validates a full contact number, excluding service and emergency short codes. */
export function isValidContactPhone(phone: unknown): boolean {
  const info = parsePhone(phone);
  return info !== null && info.type !== 'short_code';
}

/**
 * Validates whether the input is a valid Sri Lankan mobile phone number (Dialog, Mobitel, Hutch, Airtel).
 */
export function isValidMobile(phone: unknown): boolean {
  const info = parsePhone(phone);
  return info !== null && info.type === 'mobile';
}

/**
 * Validates whether the input is a valid Sri Lankan fixed/landline phone number.
 */
export function isValidLandline(phone: unknown): boolean {
  const info = parsePhone(phone);
  return info !== null && info.type === 'fixed';
}

/**
 * Validates whether the input is an official Sri Lankan emergency or government short code.
 */
export function isValidShortCode(code: unknown): boolean {
  const info = parsePhone(code);
  return info !== null && info.type === 'short_code';
}

/**
 * Detailed validation returning structured ValidationResult with error code and messages.
 */
export function validatePhone(phone: unknown): ValidationResult<PhoneInfo> {
  const cleaned = cleanString(phone);
  if (!cleaned) {
    return createFailure('Phone number is required.', 'PHONE_REQUIRED');
  }

  const info = parsePhone(cleaned);
  if (!info) {
    return createFailure(
      'Invalid Sri Lankan phone number. Must be a valid mobile (e.g. 077XXXXXXX) or landline (e.g. 011XXXXXXX).',
      'PHONE_INVALID'
    );
  }

  return createSuccess(info);
}

