/**
 * Validate, parse, and format Sri Lankan phone numbers and short codes.
 *
 * Import from `lanka-validations/phone`, or from the package root.
 *
 * Recognises mobile, fixed-line, toll-free, and public short codes; formats to national, international, E.164, or `tel:` URIs; and reports the area and originally allocated operator.
 *
 * @example
 * ```ts
 * import { isValidMobile, formatPhone, parsePhone } from 'lanka-validations/phone';
 *
 * isValidMobile('077 123 4567'); // true
 * formatPhone('0771234567', 'e164'); // '+94771234567'
 * parsePhone('0112345678')?.areaName; // 'Colombo'
 * ```
 *
 * @module phone
 */

export * from './types';
export * from './constants';
export { normalizePhoneNumber, parsePhone } from './parser';
export * from './validator';
export * from './formatter';
