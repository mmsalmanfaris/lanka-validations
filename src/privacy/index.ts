/**
 * Mask or redact identifiers before displaying or logging them.
 *
 * Import from `lanka-validations/privacy`, or from the package root.
 *
 * Masking keeps only the last few characters. `validationResultForLog` strips input and parsed data from a result.
 *
 * @example
 * ```ts
 * import { maskNic, maskPhone, validationResultForLog } from 'lanka-validations/privacy';
 * import { validateNic } from 'lanka-validations/nic';
 *
 * maskNic('921234567V'); // '******567V'
 * maskPhone('0771234567'); // '******4567'
 * validationResultForLog(validateNic('bad')); // { isValid: false, code: 'NIC_INVALID_FORMAT' }
 * ```
 *
 * @module privacy
 */

export * from './redaction';
