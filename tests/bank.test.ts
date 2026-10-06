import { describe, expect, it } from 'vitest';
import {
  getBankByCode,
  getBankList,
  isValidBankAccountNumber,
  isValidBankCode,
  isValidBranchCode,
  validateBankAccount,
} from '../src/bank';

describe('Bank Module', () => {
  it('validates major CBSL bank codes', () => {
    expect(isValidBankCode('7010')).toBe(true); // BOC
    expect(isValidBankCode('7083')).toBe(true); // Peoples
    expect(isValidBankCode('7056')).toBe(true); // ComBank
    expect(isValidBankCode('7135')).toBe(true); // Sampath
    expect(isValidBankCode('7074')).toBe(true); // HNB
    expect(isValidBankCode('7719')).toBe(true); // NSB
    expect(isValidBankCode('9999')).toBe(false);

    const boc = getBankByCode('7010');
    expect(boc?.name).toBe('Bank of Ceylon');
    expect(boc?.shortName).toBe('BOC');
  });

  it('validates branch codes (3 digits)', () => {
    expect(isValidBranchCode('001')).toBe(true);
    expect(isValidBranchCode('123')).toBe(true);
    expect(isValidBranchCode(1)).toBe(true);
    expect(isValidBranchCode('12')).toBe(false);
    expect(isValidBranchCode('1234')).toBe(false);
  });

  it('validates bank account numbers', () => {
    expect(isValidBankAccountNumber('1234567890')).toBe(true);
    expect(isValidBankAccountNumber('1234-5678-90')).toBe(true);
    expect(isValidBankAccountNumber('123')).toBe(false); // too short
  });

  it('returns bank list', () => {
    const list = getBankList();
    expect(list.length).toBeGreaterThanOrEqual(25);
  });

  it('validates full bank account with bank and branch codes', () => {
    const res = validateBankAccount('1234567890', '7010', '001');
    expect(res.isValid).toBe(true);
    expect(res.data?.bank?.shortName).toBe('BOC');
    expect(res.data?.branchCode).toBe('001');
  });
});

