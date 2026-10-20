/**
 * Validate, parse, convert, and format Sri Lankan National Identity Card (NIC) numbers.
 *
 * Import from `lanka-validations/nic`, or from the package root.
 *
 * Supports the old format (9 digits followed by V or X) and the new 12-digit format. Parsing extracts the date of birth, age, gender, and voter flag; converters switch between formats.
 *
 * @example
 * ```ts
 * import { isValidNic, parseNic, convertOldToNewNic } from 'lanka-validations/nic';
 *
 * isValidNic('921234567V'); // true
 * parseNic('921234567V')?.dobString; // '1992-05-02'
 * convertOldToNewNic('921234567V'); // '199212304567'
 * ```
 *
 * @module nic
 */

export * from './types';
export { parseNic, parseNicDayOfYear } from './parser';
export * from './validator';
export * from './converter';
export * from './formatter';
