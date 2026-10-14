/**
 * Validate Sri Lankan TIN and VAT numbers issued by the Inland Revenue Department.
 *
 * Import from `lanka-validations/tax`, or from the package root.
 *
 * Format-only checks. An NIC number is not a TIN; registration can only be confirmed with IRD.
 *
 * @example
 * ```ts
 * import { isValidTIN, isValidVAT } from 'lanka-validations/tax';
 *
 * isValidTIN('123456789'); // true
 * isValidVAT('123456789-7000'); // true
 * ```
 *
 * @module tax
 */

export * from './validator';
