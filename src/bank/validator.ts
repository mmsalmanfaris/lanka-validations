import { cleanString, createFailure, createSuccess, padZero } from '../common/utils';
import type { ValidationResult } from '../common/types';
import { CBSL_BANKS } from './data';
import type { BankInfo } from './types';

/**
 * Validates whether the given code is a valid 4-digit CBSL bank code.
 *
 * @param code - Four-digit CBSL bank code, as text or a number.
 * @returns `true` if the code belongs to a bank in the CBSL table.
 *
 * @example
 * ```ts
 * isValidBankCode('7010'); // true
 * isValidBankCode('0000'); // false
 * ```
 */
export function isValidBankCode(code: unknown): boolean {
  return getBankByCode(code) !== null;
}

/**
 *  Distinguishes malformed four-digit input from an unsupported CBSL code.
 *
 * @param code - Four-digit CBSL bank code, as text or a number.
 * @returns `{ isValid: true, data }` with a copy of the bank, or a failure with code `BANK_CODE_INVALID` or `BANK_CODE_UNSUPPORTED`.
 *
 * @example
 * ```ts
 * validateBankCode('7010').isValid; // true
 * validateBankCode('0000').code; // 'BANK_CODE_UNSUPPORTED'
 * ```
 */
export function validateBankCode(code: unknown): ValidationResult<BankInfo> {
  const normalized =
    typeof code === 'number' && Number.isInteger(code) ? padZero(code, 4) : cleanString(code);
  if (!/^[0-9]{4}$/.test(normalized)) {
    return createFailure('Bank code must contain exactly four digits.', 'BANK_CODE_INVALID_FORMAT');
  }
  const bank = getBankByCode(normalized);
  return bank
    ? createSuccess(bank)
    : createFailure(
        'CBSL bank code is not in the bundled reference data.',
        'BANK_CODE_UNSUPPORTED',
      );
}

/**
 * Looks up bank details by CBSL 4-digit bank code.
 *
 * @param code - Four-digit CBSL bank code, as text or a number.
 * @returns A copy of the bank's details, or `null` if unknown.
 *
 * @example
 * ```ts
 * getBankByCode('7010')?.name; // 'Bank of Ceylon'
 * getBankByCode(7278)?.shortName; // 'NDB'
 * ```
 */
export function getBankByCode(code: unknown): BankInfo | null {
  if (typeof code === 'number') {
    code = padZero(code, 4);
  }
  const cleaned = cleanString(code);
  return /^[0-9]{4}$/.test(cleaned) && Object.hasOwn(CBSL_BANKS, cleaned)
    ? { ...CBSL_BANKS[cleaned]! }
    : null;
}

/**
 * Returns the list of all CBSL recognized banks.
 *
 * @returns Copies of every bank in the CBSL table.
 *
 * @example
 * ```ts
 * getBankList().length > 0; // true
 * ```
 */
export function getBankList(): BankInfo[] {
  return Object.values(CBSL_BANKS).map((bank) => ({ ...bank }));
}

/**
 * Validates a 3-digit CBSL branch code.
 *
 * @param code - Three-digit branch code, as text or a number.
 * @returns `true` if the code is three digits.
 *
 * @example
 * ```ts
 * isValidBranchCode('001'); // true
 * isValidBranchCode('1'); // false
 * ```
 */
export function isValidBranchCode(code: unknown): boolean {
  if (typeof code === 'number') {
    code = padZero(code, 3);
  }
  const cleaned = cleanString(code);
  return /^\d{3}$/.test(cleaned);
}

/**
 * Validates Sri Lankan bank account number format.
 * Must be numeric and between 6 to 18 digits.
 *
 * @param acc - Account number. Spaces and hyphens are ignored.
 * @returns `true` if the account number is numeric and of an accepted length.
 *
 * @example
 * ```ts
 * isValidBankAccountNumber('1234-5678-90'); // true
 * isValidBankAccountNumber('12AB'); // false
 * ```
 */
export function isValidBankAccountNumber(acc: unknown): boolean {
  const cleaned = cleanString(acc).replace(/[\s-]/g, '');
  return /^\d{6,18}$/.test(cleaned);
}

/**
 * Validates a bank account number returning detailed ValidationResult.
 *
 * @param acc - Account number. Spaces and hyphens are ignored.
 * @param bankCode - Optional CBSL bank code to validate and include.
 * @param branchCode - Optional three-digit branch code to validate and include.
 * @returns `{ isValid: true, data }` with the account, bank, and branch, or `{ isValid: false, error, errors, code }`.
 *
 * @example
 * ```ts
 * validateBankAccount('1234567890', '7010').isValid; // true
 * validateBankAccount('1234567890', '0000').code; // 'BANK_CODE_INVALID'
 * ```
 */
export function validateBankAccount(
  acc: unknown,
  bankCode?: unknown,
  branchCode?: unknown,
): ValidationResult<{
  account: string;
  bank?: BankInfo | undefined;
  branchCode?: string | undefined;
}> {
  const cleaned = cleanString(acc).replace(/[\s-]/g, '');

  if (!cleaned) {
    return createFailure('Bank account number is required.', 'BANK_ACC_REQUIRED');
  }

  if (!/^\d{6,18}$/.test(cleaned)) {
    return createFailure(
      'Invalid bank account number format. Expected 6 to 18 digits.',
      'BANK_ACC_INVALID',
    );
  }

  let bank: BankInfo | undefined;
  if (bankCode !== undefined && bankCode !== null && bankCode !== '') {
    const bankFound = getBankByCode(bankCode);
    if (!bankFound) {
      return createFailure('Invalid CBSL bank code.', 'BANK_CODE_INVALID');
    }
    bank = bankFound;
  }

  let branch: string | undefined;
  if (branchCode !== undefined && branchCode !== null && branchCode !== '') {
    if (!isValidBranchCode(branchCode)) {
      return createFailure('Invalid branch code. Expected 3 digits.', 'BRANCH_CODE_INVALID');
    }
    branch = typeof branchCode === 'number' ? padZero(branchCode, 3) : cleanString(branchCode);
  }

  return createSuccess({
    account: cleaned,
    bank,
    branchCode: branch,
  });
}
