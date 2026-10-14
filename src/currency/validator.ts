import { cleanString, createFailure, createSuccess } from '../common/utils';
import type { ValidationResult } from '../common/types';
import { parseLKR } from './parser';

/** Range options for {@link isValidLKR} and {@link validateLKR}. Bounds are inclusive. */
export interface LkrValidationOptions {
  /** Minimum allowable amount */
  min?: number;
  /** Maximum allowable amount */
  max?: number;
  /** Whether negative amounts are allowed. Default: false */
  allowNegative?: boolean;
}

/**
 * Validates whether the given value is a valid Sri Lankan currency amount.
 *
 * @param input - Amount as a number or text.
 * @param options - Optional `{ min, max, allowNegative }`. Bounds are inclusive; negatives are rejected by default.
 * @returns `true` if the amount parses and is within the bounds.
 *
 * @example
 * ```ts
 * isValidLKR('Rs. 1,500.00'); // true
 * isValidLKR(-10); // false
 * isValidLKR(250, { min: 500 }); // false
 * ```
 */
export function isValidLKR(input: unknown, options?: LkrValidationOptions): boolean {
  const num = parseLKR(input);
  if (num === null) return false;

  if (options?.allowNegative !== true && num < 0) {
    return false;
  }
  if (options?.min !== undefined && num < options.min) {
    return false;
  }
  if (options?.max !== undefined && num > options.max) {
    return false;
  }

  return true;
}

/**
 * Validates a Sri Lankan currency amount and returns detailed ValidationResult.
 *
 * @param input - Amount as a number or text.
 * @param options - Optional `{ min, max, allowNegative }`.
 * @returns `{ isValid: true, data }` with the amount as a number, or `{ isValid: false, error, errors, code }`.
 *
 * @example
 * ```ts
 * validateLKR('Rs. 1,500.00').isValid; // true
 * validateLKR(250, { min: 500 }).code; // 'CURRENCY_BELOW_MIN'
 * ```
 */
export function validateLKR(
  input: unknown,
  options?: LkrValidationOptions,
): ValidationResult<number> {
  const str = cleanString(input);
  if (!str && typeof input !== 'number') {
    return createFailure('Currency amount is required.', 'CURRENCY_REQUIRED');
  }

  const num = parseLKR(input);
  if (num === null) {
    return createFailure(
      'Invalid Sri Lankan Rupee amount format. Example: "Rs. 1,500.00" or "1500".',
      'CURRENCY_INVALID',
    );
  }

  if (options?.allowNegative !== true && num < 0) {
    return createFailure('Currency amount cannot be negative.', 'CURRENCY_NEGATIVE');
  }

  if (options?.min !== undefined && num < options.min) {
    return createFailure(`Currency amount must be at least ${options.min}.`, 'CURRENCY_BELOW_MIN');
  }

  if (options?.max !== undefined && num > options.max) {
    return createFailure(`Currency amount must not exceed ${options.max}.`, 'CURRENCY_EXCEEDS_MAX');
  }

  return createSuccess(num);
}
