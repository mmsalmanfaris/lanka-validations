/**
 * Validate dates of birth, calculate age, and check them against an NIC.
 *
 * Import from `lanka-validations/dob`, or from the package root.
 *
 * Accepts `YYYY-MM-DD`, `YYYY/MM/DD`, `DD-MM-YYYY`, `DD/MM/YYYY`, or a `Date`, and enforces optional age limits. Ages use the UTC calendar date.
 *
 * @example
 * ```ts
 * import { isValidDob, calculateAge } from 'lanka-validations/dob';
 *
 * const on = new Date('2026-01-01');
 * isValidDob('2000-01-15', { minAge: 18, referenceDate: on }); // true
 * calculateAge('2000-01-15', on); // 25
 * ```
 *
 * @module dob
 */

export * from './types';
export * from './validator';
