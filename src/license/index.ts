/**
 * Validate Sri Lankan driving licence numbers and DMT vehicle classes.
 *
 * Import from `lanka-validations/license`, or from the package root.
 *
 * Accepts legacy, smart-card, and NIC-based licence numbers, and looks up DMT vehicle classes with their minimum ages.
 *
 * @example
 * ```ts
 * import { isValidDrivingLicense, getLicenseCategoryInfo } from 'lanka-validations/license';
 *
 * isValidDrivingLicense('B1234567'); // true
 * getLicenseCategoryInfo('B1')?.minAge; // 18
 * ```
 *
 * @module license
 */

export * from './types';
export * from './constants';
export * from './parser';
export * from './validator';
