import type { ValidationResult } from '../common/types';
import { cleanString, createFailure, createSuccess } from '../common/utils';

export type ExcessDecimalPolicy = 'reject' | 'round' | 'truncate';

export interface LkrDecimalOptions {
  /** Reject negative amounts unless explicitly enabled. */
  allowNegative?: boolean;
  /** Behavior when more than two decimal places are supplied. Defaults to reject. */
  excessDecimals?: ExcessDecimalPolicy;
  /** Maximum absolute amount in cents. Defaults to Number.MAX_SAFE_INTEGER cents. */
  maxMinorUnits?: bigint;
}

export interface LkrMinorUnitAmount {
  /** Exact signed amount in cents. */
  minorUnits: bigint;
  /** Canonical decimal representation without a currency symbol or grouping. */
  decimal: string;
}

export const MAX_LKR_MINOR_UNITS = BigInt(Number.MAX_SAFE_INTEGER);

function formatAbsoluteMinorUnits(value: bigint): string {
  const digits = value.toString().padStart(3, '0');
  return `${digits.slice(0, -2)}.${digits.slice(-2)}`;
}

/** Formats an exact cents value as an ungrouped decimal string. */
export function formatLKRMinorUnits(minorUnits: bigint): string {
  const negative = minorUnits < 0n;
  const absolute = negative ? -minorUnits : minorUnits;
  return `${negative ? '-' : ''}${formatAbsoluteMinorUnits(absolute)}`;
}

/**
 * Parses a decimal string into exact cents. Numbers are intentionally rejected
 * because they may already have lost decimal precision.
 */
export function validateLKRDecimal(
  input: unknown,
  options: LkrDecimalOptions = {},
): ValidationResult<LkrMinorUnitAmount> {
  if (typeof input !== 'string') {
    return createFailure('Expected a decimal string.', 'CURRENCY_INVALID');
  }

  let value = cleanString(input);
  if (!value) return createFailure('Currency amount is required.', 'CURRENCY_REQUIRED');

  let negative = false;
  if (value.startsWith('(') && value.endsWith(')')) {
    negative = true;
    value = value.slice(1, -1).trim();
  } else if (value.startsWith('-')) {
    negative = true;
    value = value.slice(1).trim();
  }

  const prefix = /^(?:Rs\.?|රු\.?|ரூ\.?|LKR)\s*/i;
  const suffix = /\s*(?:Rs\.?|රු\.?|ரூ\.?|LKR)$/i;
  if (prefix.test(value)) value = value.replace(prefix, '');
  else if (suffix.test(value)) value = value.replace(suffix, '');

  const match = /^(?:[0-9]+|[0-9]{1,3}(?:,[0-9]{3})+|[0-9]{1,2}(?:,[0-9]{2})+,[0-9]{3})(?:\.([0-9]+))?$/.exec(value);
  if (!match) return createFailure('Currency amount is invalid.', 'CURRENCY_INVALID');
  if (negative && !options.allowNegative) {
    return createFailure('Negative amounts are not allowed.', 'CURRENCY_NEGATIVE');
  }

  const fraction = match[1] ?? '';
  const policy = options.excessDecimals ?? 'reject';
  if (fraction.length > 2 && policy === 'reject') {
    return createFailure('Amount has more than two decimal places.', 'CURRENCY_EXCESS_DECIMALS');
  }

  const wholeText = value.split('.')[0].replace(/,/g, '');
  let absoluteMinor = BigInt(wholeText) * 100n + BigInt((fraction.slice(0, 2) || '').padEnd(2, '0') || '0');
  if (fraction.length > 2 && policy === 'round' && Number(fraction[2]) >= 5) absoluteMinor += 1n;

  const max = options.maxMinorUnits ?? MAX_LKR_MINOR_UNITS;
  if (max < 0n) return createFailure('Maximum minor units must not be negative.', 'CURRENCY_INVALID');
  if (absoluteMinor > max) return createFailure('Amount exceeds the maximum.', 'CURRENCY_EXCEEDS_MAX');

  const minorUnits = negative && absoluteMinor !== 0n ? -absoluteMinor : absoluteMinor;
  return createSuccess({ minorUnits, decimal: formatLKRMinorUnits(minorUnits) });
}

/** Returns exact cents, or null when the decimal string is invalid. */
export function parseLKRMinorUnits(input: unknown, options?: LkrDecimalOptions): bigint | null {
  const result = validateLKRDecimal(input, options);
  return result.isValid ? result.data.minorUnits : null;
}
