import { describe, expect, it } from 'vitest';
import {
  getBankByCode,
  getBankList,
  isValidBankAccountNumber,
  isValidBankCode,
  isValidBranchCode,
  validateBankAccount,
  validateBankCode,
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

  it('validates bank codes given as numbers', () => {
    const res = validateBankCode(7010);
    expect(res.isValid).toBe(true);
    expect(res.data?.code).toBe('7010');

    expect(validateBankCode(7010.5).code).toBe('BANK_CODE_INVALID_FORMAT');
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

  it('validates a bank account without bank or branch codes', () => {
    const res = validateBankAccount('1234567890');
    expect(res.isValid).toBe(true);
    expect(res.data?.account).toBe('1234567890');
    expect(res.data?.bank).toBeUndefined();
    expect(res.data?.branchCode).toBeUndefined();
  });

  it('pads a numeric branch code', () => {
    expect(validateBankAccount('1234567890', '7010', 1).data?.branchCode).toBe('001');
  });

  it('rejects malformed bank account numbers', () => {
    expect(validateBankAccount('12AB5678').code).toBe('BANK_ACC_INVALID');
    expect(validateBankAccount('12345').code).toBe('BANK_ACC_INVALID');
  });
});
