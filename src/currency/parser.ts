import { cleanString } from '../common/utils';

/**
 * Parses a currency string in Sri Lankan Rupee format (e.g. 'Rs. 1,500.50', 'LKR 2500', 'රු. 500')
 * into a valid numeric float.
 * Returns the parsed number, or null if invalid.
 */
export function parseLKR(input: unknown): number | null {
  if (typeof input === 'number') {
    return isNaN(input) ? null : input;
  }

  const str = cleanString(input);
  if (!str) return null;

  // Check negative
  const isNegative = /^\s*-\s*/.test(str) || /\(\s*.*\s*\)/.test(str);

  // Remove currency symbols, parentheses, commas, whitespace
  const sanitized = str
    .replace(/^-\s*/, '')
    .replace(/^\(|\)$/g, '')
    .replace(/(?:Rs\.?|රු\.?|ரூ\.?|LKR)\s*/gi, '')
    .replace(/,/g, '')
    .trim();

  if (!/^\d+(\.\d+)?$/.test(sanitized)) {
    return null;
  }

  const num = parseFloat(sanitized);
  if (isNaN(num)) return null;

  return isNegative ? -num : num;
}
