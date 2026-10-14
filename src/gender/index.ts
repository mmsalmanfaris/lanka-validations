/**
 * Normalise gender values in English, Sinhala, and Tamil, and check them against an NIC.
 *
 * Import from `lanka-validations/gender`, or from the package root.
 *
 * Maps common spellings and abbreviations to `'male'` or `'female'`.
 *
 * @example
 * ```ts
 * import { normalizeGender, matchesNicGender } from 'lanka-validations/gender';
 *
 * normalizeGender('F'); // 'female'
 * matchesNicGender('male', '921234567V'); // true
 * ```
 *
 * @module gender
 */

export * from './validator';
