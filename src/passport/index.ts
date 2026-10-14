/**
 * Validate and parse Sri Lankan passport numbers.
 *
 * Import from `lanka-validations/passport`, or from the package root.
 *
 * Classifies the passport type from its series prefix. The check is format-only; it does not verify issuance or a check digit.
 *
 * @example
 * ```ts
 * import { isValidPassport, parsePassport } from 'lanka-validations/passport';
 *
 * isValidPassport('N1234567'); // true
 * parsePassport('N1234567')?.type; // 'ordinary'
 * ```
 *
 * @module passport
 */

export * from './types';
export * from './parser';
export * from './validator';
