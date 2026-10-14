import type { ValidationResult } from '../common/types';
import { cleanString } from '../common/utils';
import { isValidBankAccountNumber } from '../bank';
import { parseNic } from '../nic';
import { parsePhone } from '../phone';

/** Placeholder returned by {@link redactSensitiveValue}. */
export const REDACTED_VALUE = '[REDACTED]' as const;

/** Replaces any supplied value without coercing or inspecting it. */
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

/** Masks a valid NIC for display. Returns null for invalid input. */
export function maskNic(input: unknown, visibleDigits = 4): string | null {
  const parsed = parseNic(input);
  return parsed ? maskKeepingLast(parsed.nic, visibleDigits) : null;
}

/** Masks a valid phone number. Short codes are fully redacted. */
export function maskPhone(input: unknown, visibleDigits = 4): string | null {
  const parsed = parsePhone(input);
  if (!parsed) return null;
  return parsed.type === 'short_code'
    ? '*'.repeat(parsed.normalized.length)
    : maskKeepingLast(parsed.normalized, visibleDigits);
}

/** Masks a valid bank account number after removing supported separators. */
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

/** Produces code-only validation metadata suitable for application logs. */
export function validationResultForLog(result: ValidationResult<unknown>): SafeValidationLog {
  return result.isValid ? { isValid: true } : { isValid: false, code: result.code };
}
