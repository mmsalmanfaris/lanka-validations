import type { ValidationResult } from '../common/types';
import { cleanString } from '../common/utils';
import { isValidBankAccountNumber } from '../bank';
import { parseNic } from '../nic';
import { parsePhone } from '../phone';

/** Placeholder returned by {@link redactSensitiveValue}. */
export const REDACTED_VALUE = '[REDACTED]' as const;

/**
 *  Replaces any supplied value without coercing or inspecting it.
 *
 * @param _value - Any value. It is not read or converted.
 * @returns Always `'[REDACTED]'`.
 *
 * @example
 * ```ts
 * redactSensitiveValue('921234567V'); // '[REDACTED]'
 * ```
 */
export function redactSensitiveValue(_value: unknown): typeof REDACTED_VALUE {
  return REDACTED_VALUE;
}

function maskKeepingLast(value: string, visibleDigits: number): string {
  // Non-finite requests fail closed. Slice from an explicit index: slice(-0) would return everything.
  const requested = Number.isFinite(visibleDigits) ? Math.floor(visibleDigits) : 0;
  const visible = Math.max(0, Math.min(requested, value.length));
  const start = value.length - visible;
  return `${'*'.repeat(start)}${value.slice(start)}`;
}

/**
 *  Masks a valid NIC for display. Returns null for invalid input.
 *
 * @param input - NIC number.
 * @param visibleDigits - Characters to leave visible at the end. Defaults to 4; invalid values reveal nothing.
 * @returns The masked NIC, or `null` if the NIC is invalid.
 *
 * @example
 * ```ts
 * maskNic('921234567V'); // '******567V'
 * maskNic('921234567V', 0); // '**********'
 * ```
 */
export function maskNic(input: unknown, visibleDigits = 4): string | null {
  const parsed = parseNic(input);
  return parsed ? maskKeepingLast(parsed.nic, visibleDigits) : null;
}

/**
 *  Masks a valid phone number. Short codes are fully redacted.
 *
 * @param input - Phone number.
 * @param visibleDigits - Digits to leave visible at the end. Defaults to 4.
 * @returns The masked national number, or `null` if invalid. Short codes are fully masked.
 *
 * @example
 * ```ts
 * maskPhone('0771234567'); // '******4567'
 * ```
 */
export function maskPhone(input: unknown, visibleDigits = 4): string | null {
  const parsed = parsePhone(input);
  if (!parsed) return null;
  return parsed.type === 'short_code'
    ? '*'.repeat(parsed.normalized.length)
    : maskKeepingLast(parsed.normalized, visibleDigits);
}

/**
 *  Masks a valid bank account number after removing supported separators.
 *
 * @param input - Bank account number.
 * @param visibleDigits - Digits to leave visible at the end. Defaults to 4.
 * @returns The masked account number, or `null` if invalid.
 *
 * @example
 * ```ts
 * maskBankAccount('1234-5678-90'); // '******7890'
 * ```
 */
export function maskBankAccount(input: unknown, visibleDigits = 4): string | null {
  if (!isValidBankAccountNumber(input)) return null;
  const normalized = cleanString(input).replace(/[\s-]/g, '');
  return maskKeepingLast(normalized, visibleDigits);
}

/** A validation outcome with the input value removed, safe to write to logs. */
export interface SafeValidationLog {
  isValid: boolean;
  code?: string;
}

/**
 *  Produces code-only validation metadata suitable for application logs.
 *
 * @param result - Any validation result.
 * @returns `{ isValid }` plus `code` on failure, without the input or parsed data.
 *
 * @example
 * ```ts
 * validationResultForLog(validateNic('921234567V')); // { isValid: true }
 * validationResultForLog(validateNic('bad')); // { isValid: false, code: 'NIC_INVALID_FORMAT' }
 * ```
 */
export function validationResultForLog(result: ValidationResult<unknown>): SafeValidationLog {
  return result.isValid ? { isValid: true } : { isValid: false, code: result.code };
}
