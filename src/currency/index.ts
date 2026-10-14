/**
 * Parse, validate, and format Sri Lankan rupee (LKR) amounts, and write them in words.
 *
 * Import from `lanka-validations/currency`, or from the package root.
 *
 * Supports Western and lakh grouping, currency symbols, amounts in words in English, Sinhala, and Tamil, and exact cent arithmetic with `bigint`.
 *
 * @example
 * ```ts
 * import { parseLKR, formatLKR, lkrToWords, parseLKRMinorUnits } from 'lanka-validations/currency';
 *
 * parseLKR('Rs. 12,34,567.50'); // 1234567.5
 * formatLKR(1500000, { lakhScale: true }); // 'Rs. 15,00,000.00'
 * lkrToWords(1250.5); // 'One Thousand Two Hundred Fifty Rupees and Fifty Cents Only'
 * parseLKRMinorUnits('1250.50'); // 125050n
 * ```
 *
 * @module currency
 */

export * from './types';
export * from './parser';
export * from './validator';
export * from './formatter';
export * from './words';
export * from './minor-units';
