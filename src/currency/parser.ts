import { cleanString } from '../common/utils';

/** Maximum magnitude accepted by the floating-point parser (rupees). */
export const MAX_LKR_AMOUNT = Number.MAX_SAFE_INTEGER / 100;

/**
 * Parses ungrouped, Western-grouped or South Asian-grouped amounts.
 * One optional currency prefix OR suffix is allowed, with a leading minus
 * or enclosing parentheses for negatives. Returns an approximate JS number;
 * fractional digits are preserved without rounding, subject to Number precision.
 */
export function parseLKR(input: unknown): number | null {
  if (typeof input === 'number') {
    return Number.isFinite(input) && Math.abs(input) <= MAX_LKR_AMOUNT ? input : null;
  }

  let str = cleanString(input);
  if (!str) return null;

  let negative = false;
  if (str.startsWith('(') && str.endsWith(')')) {
    negative = true;
    str = str.slice(1, -1).trim();
  } else if (str.startsWith('-')) {
    negative = true;
    str = str.slice(1).trim();
  }

  const prefix = /^(?:Rs\.?|රු\.?|ரூ\.?|LKR)\s*/i;
  const suffix = /\s*(?:Rs\.?|රු\.?|ரூ\.?|LKR)$/i;
  if (prefix.test(str)) str = str.replace(prefix, '');
  else str = str.replace(suffix, '');

  // Grouping must be validated before commas are removed.
  if (!/^(?:[0-9]+|[0-9]{1,3}(?:,[0-9]{3})+|[0-9]{1,2}(?:,[0-9]{2})+,[0-9]{3})(?:\.[0-9]+)?$/.test(str)) {
    return null;
  }
  const amount = Number(str.replace(/,/g, ''));
  if (!Number.isFinite(amount) || amount > MAX_LKR_AMOUNT) return null;
  return negative ? -amount : amount;
}
