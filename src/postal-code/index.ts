/**
 * Validate Sri Lankan postal codes and find their district and province.
 *
 * Import from `lanka-validations/postal-code`, or from the package root.
 *
 * Checks the five-digit format and the two-digit routing prefix. It does not confirm that a specific post office uses the code.
 *
 * @example
 * ```ts
 * import { isValidPostalCode, lookupPostalCode } from 'lanka-validations/postal-code';
 *
 * isValidPostalCode('00100'); // true
 * lookupPostalCode('20000')?.district; // 'Kandy'
 * ```
 *
 * @module postal-code
 */

export * from './types';
export * from './data';
export * from './validator';
