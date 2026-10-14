/**
 * Validate Central Bank of Sri Lanka (CBSL) bank and branch codes and account numbers.
 *
 * Import from `lanka-validations/bank`, or from the package root.
 *
 * Looks up licensed banks by their four-digit CBSL code. Lookups return copies you can change safely.
 *
 * @example
 * ```ts
 * import { isValidBankCode, getBankByCode, isValidBranchCode } from 'lanka-validations/bank';
 *
 * isValidBankCode('7010'); // true
 * getBankByCode('7010')?.shortName; // 'BOC'
 * isValidBranchCode('001'); // true
 * ```
 *
 * @module bank
 */

export * from './types';
export * from './data';
export * from './validator';
