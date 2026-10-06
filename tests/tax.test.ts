import { describe, expect, it } from 'vitest';
import {
  isValidTIN,
  isValidVAT,
  validateTIN,
  validateVAT,
} from '../src/tax';

describe('Tax Module', () => {
  it('validates 9-digit and 10-digit TIN numbers', () => {
    expect(isValidTIN('123456789')).toBe(true);
    expect(isValidTIN('1234567890')).toBe(true);
  });

  it('validates NIC-based TIN numbers', () => {
    expect(isValidTIN('921234567V')).toBe(true);
    expect(isValidTIN('199212304567')).toBe(true);
  });

  it('rejects invalid TIN numbers', () => {
    expect(isValidTIN('123')).toBe(false);
    expect(isValidTIN('abc')).toBe(false);
  });

  it('validates VAT registration numbers', () => {
    expect(isValidVAT('123456789-7000')).toBe(true);
    expect(isValidVAT('1234567897000')).toBe(true);
    expect(isValidVAT('123456789')).toBe(true);
    expect(isValidVAT('123456789012')).toBe(true);
    expect(isValidVAT('invalid')).toBe(false);
  });

  it('returns structured validation result', () => {
    expect(validateTIN('123456789').isValid).toBe(true);
    expect(validateTIN('').isValid).toBe(false);
    expect(validateVAT('123456789-7000').isValid).toBe(true);
    expect(validateVAT('').isValid).toBe(false);
  });
});
