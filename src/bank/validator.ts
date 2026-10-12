import { cleanString, createFailure, createSuccess, padZero } from '../common/utils';
import type { ValidationResult } from '../common/types';
import { CBSL_BANKS } from './data';
import type { BankInfo } from './types';

/**
 * Validates whether the given code is a valid 4-digit CBSL bank code.
 */
export function isValidBankCode(code: unknown): boolean {
  return getBankByCode(code) !== null;
}

/** Distinguishes malformed four-digit input from an unsupported CBSL code. */
export function validateBankCode(code: unknown): ValidationResult<BankInfo> {
  const normalized = typeof code === 'number' && Number.isInteger(code)
    ? padZero(code, 4) : cleanString(code);
  if (!/^[0-9]{4}$/.test(normalized)) {
    return createFailure('Bank code must contain exactly four digits.', 'BANK_CODE_INVALID_FORMAT');
  }
  const bank = getBankByCode(normalized);
  return bank
    ? createSuccess(bank)
    : createFailure('CBSL bank code is not in the bundled reference data.', 'BANK_CODE_UNSUPPORTED');
}

/**
 * Looks up bank details by CBSL 4-digit bank code.
 */
export function getBankByCode(code: unknown): BankInfo | null {
  if (typeof code === 'number') {
    code = padZero(code, 4);
  }
  const cleaned = cleanString(code);
  return /^[0-9]{4}$/.test(cleaned) && Object.hasOwn(CBSL_BANKS, cleaned)
    ? { ...CBSL_BANKS[cleaned] }
    : null;
}

/**
 * Returns the list of all CBSL recognized banks.
 */
export function getBankList(): BankInfo[] {
  return Object.values(CBSL_BANKS).map(bank => ({ ...bank }));
}

/**
 * Validates a 3-digit CBSL branch code.
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
 */
export function isValidBankAccountNumber(acc: unknown): boolean {
  const cleaned = cleanString(acc).replace(/[\s\-]/g, '');
  return /^\d{6,18}$/.test(cleaned);
}

/**
 * Validates a bank account number returning detailed ValidationResult.
 */
export function validateBankAccount(
  acc: unknown,
  bankCode?: unknown,
  branchCode?: unknown
): ValidationResult<{ account: string; bank?: BankInfo; branchCode?: string }> {
  const cleaned = cleanString(acc).replace(/[\s\-]/g, '');

  if (!cleaned) {
    return createFailure('Bank account number is required.', 'BANK_ACC_REQUIRED');
  }

  if (!/^\d{6,18}$/.test(cleaned)) {
    return createFailure(
      'Invalid bank account number format. Expected 6 to 18 digits.',
      'BANK_ACC_INVALID'
    );
  }

  let bank: BankInfo | undefined;
  if (bankCode !== undefined && bankCode !== null && bankCode !== '') {
    const bankFound = getBankByCode(bankCode);
    if (!bankFound) {
      return createFailure(
        'Invalid CBSL bank code.',
        'BANK_CODE_INVALID'
      );
    }
    bank = bankFound;
  }

  let branch: string | undefined;
  if (branchCode !== undefined && branchCode !== null && branchCode !== '') {
    if (!isValidBranchCode(branchCode)) {
      return createFailure(
        'Invalid branch code. Expected 3 digits.',
        'BRANCH_CODE_INVALID'
      );
    }
    branch = typeof branchCode === 'number' ? padZero(branchCode, 3) : cleanString(branchCode);
  }

  return createSuccess({
    account: cleaned,
    bank,
    branchCode: branch,
  });
}

