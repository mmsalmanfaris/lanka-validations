/**
 * Source, as-of date, coverage, and limitations of every bundled reference table.
 *
 * Import from `lanka-validations/reference-data`, or from the package root.
 *
 * Use it to show users where data comes from or to check how current a table is.
 *
 * @example
 * ```ts
 * import { getReferenceDataMetadata } from 'lanka-validations/reference-data';
 *
 * getReferenceDataMetadata('CBSL_BANKS').lastVerified; // '2026-10-12'
 * ```
 *
 * @module reference-data
 */

export * from './types';
export * from './metadata';
