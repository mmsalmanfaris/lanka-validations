import { describe, expect, it } from 'vitest';
import { validateBankCode } from '../src/bank';
import { validatePhone } from '../src/phone';

describe('malformed and unsupported classification', () => {
  it('distinguishes bank-code syntax from reference-data coverage', () => {
    expect(validateBankCode('abc').isValid ? '' : validateBankCode('abc').code).toBe(
      'BANK_CODE_INVALID_FORMAT',
    );
    expect(validateBankCode('9999').isValid ? '' : validateBankCode('9999').code).toBe(
      'BANK_CODE_UNSUPPORTED',
    );
  });

  it('distinguishes phone syntax from reference-data coverage', () => {
    expect(validatePhone('abc').isValid ? '' : validatePhone('abc').code).toBe('PHONE_INVALID');
    expect(validatePhone('0731234567').isValid ? '' : validatePhone('0731234567').code).toBe(
      'PHONE_UNSUPPORTED',
    );
  });
});
