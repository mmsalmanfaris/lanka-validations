import type { FormatLkrOptions } from './types';

/**
 * Formats a numeric string with South Asian numbering system (e.g., 12,34,567.89).
 */
function formatSouthAsianNumber(val: number, decimals: number): string {
  const parts = val.toFixed(decimals).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];

  const isNeg = integerPart.startsWith('-');
  if (isNeg) {
    integerPart = integerPart.slice(1);
  }

  if (integerPart.length <= 3) {
    return (isNeg ? '-' : '') + integerPart + (decimalPart !== undefined ? `.${decimalPart}` : '');
  }

  const lastThree = integerPart.slice(-3);
  const remaining = integerPart.slice(0, -3);

  // Group the rest into pairs of two from right to left
  const pairs: string[] = [];
  for (let i = remaining.length; i > 0; i -= 2) {
    const start = Math.max(0, i - 2);
    pairs.unshift(remaining.slice(start, i));
  }

  const formattedInt = pairs.join(',') + ',' + lastThree;
  return (isNeg ? '-' : '') + formattedInt + (decimalPart !== undefined ? `.${decimalPart}` : '');
}

/**
 * Formats a number as Sri Lankan Rupee currency string.
 *
 * Examples:
 * - formatLKR(1500) -> 'Rs. 1,500.00'
 * - formatLKR(1500, { symbol: 'LKR' }) -> 'LKR 1,500.00'
 * - formatLKR(1500000, { lakhScale: true }) -> 'Rs. 15,00,000.00'
 * - formatLKR(250, { symbol: 'රු.' }) -> 'රු. 250.00'
 */
export function formatLKR(amount: number, options?: FormatLkrOptions): string {
  const symbol = options?.symbol !== undefined ? options.symbol : 'Rs. ';
  const position = options?.symbolPosition ?? 'prefix';
  const decimals = options?.decimals ?? 2;
  const useGrouping = options?.useGrouping ?? true;
  const lakhScale = options?.lakhScale ?? false;

  let formattedNum: string;

  if (!useGrouping) {
    formattedNum = amount.toFixed(decimals);
  } else if (lakhScale) {
    formattedNum = formatSouthAsianNumber(amount, decimals);
  } else {
    // Western grouping: 1,500,000.00
    const parts = amount.toFixed(decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    formattedNum = parts.join('.');
  }

  const sym = symbol.trim() ? `${symbol.trim()} ` : '';

  if (position === 'suffix') {
    return `${formattedNum} ${symbol}`.trim();
  }

  return `${sym}${formattedNum}`;
}
