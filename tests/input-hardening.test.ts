import { describe, expect, it } from 'vitest';
import {
  isValidBankCode,
  getBankByCode,
  validateBankAccount,
  isValidNic,
  validateNic,
  isValidPhone,
  parsePhone,
  validatePhone,
  isValidMobile,
  isValidShortCode,
  isValidContactPhone,
  lookupPostalCode,
  isValidPostalCode,
  validatePostalCode,
  parseLKR,
  isValidLKR,
  validateLKR,
  lkrToWords,
  isValidDob,
  validateDob,
  calculateAge,
  createSchemaValidator,
} from '../src';
import { cleanString } from '../src/common/utils';
import { MAX_LKR_AMOUNT } from '../src/currency';
import type { DobOptions } from '../src/dob';

describe('untrusted input regressions', () => {
  it.each(['__proto__', 'constructor', 'toString', 'hasOwnProperty', '9999', '７０１０', 7010.5])(
    'rejects invalid bank code %s through every entry point',
    (code) => {
      expect(isValidBankCode(code)).toBe(false);
      expect(getBankByCode(code)).toBeNull();
      expect(validateBankAccount('12345678', code).isValid).toBe(false);
    },
  );

  it('preserves numeric bank lookup', () => {
    expect(getBankByCode(7010)?.code).toBe('7010');
  });

  const invalidInputs = [
    null,
    undefined,
    true,
    false,
    [],
    ['0771234567'],
    {},
    JSON.parse('{"toString":null}'),
    Object.create(null),
    Symbol('input'),
    1n,
    {
      toString() {
        throw new Error('must not coerce');
      },
    },
    NaN,
    Infinity,
    -Infinity,
  ];
  it.each(invalidInputs)('rejects unsupported scalar input %# without coercion', (value) => {
    expect(cleanString(value)).toBe('');
    expect(isValidNic(value)).toBe(false);
    expect(validateNic(value).isValid).toBe(false);
    expect(isValidPhone(value)).toBe(false);
    expect(validatePhone(value).isValid).toBe(false);
    expect(validatePostalCode(value).isValid).toBe(false);
    expect(validateLKR(value).isValid).toBe(false);
    expect(isValidBankCode(value)).toBe(false);
    expect(validateBankAccount(value).isValid).toBe(false);
  });

  it('does not coerce invalid bank/branch metadata when constructing errors', () => {
    const invalid: unknown = JSON.parse('{"toString":null}');
    expect(validateBankAccount('12345678', invalid).code).toBe('BANK_CODE_INVALID');
    expect(validateBankAccount('12345678', '7010', invalid).code).toBe('BRANCH_CODE_INVALID');
  });

  it.each(['abc119xyz', '+119', '1-19', '119.0', 'abc0771234567', '077+1234567', '++94771234567'])(
    'rejects malformed phone %s',
    (input) => {
      expect(parsePhone(input)).toBeNull();
      expect(validatePhone(input).isValid).toBe(false);
    },
  );
  it('separates short codes from contact/mobile numbers', () => {
    expect(isValidPhone('119')).toBe(true);
    expect(isValidShortCode(119)).toBe(true);
    expect(isValidContactPhone('119')).toBe(false);
    expect(isValidMobile('119')).toBe(false);
    expect(isValidContactPhone('+94 77 123 4567')).toBe(true);
    expect(isValidContactPhone('0112345678')).toBe(true);
    expect(isValidPhone(771234567)).toBe(true);
  });

  it.each(['abc20000xyz', '200.5', 200.5, -1, 100000, '20 000', '20-000', '２００００'])(
    'rejects malformed postal code %s',
    (value) => {
      expect(lookupPostalCode(value)).toBeNull();
      expect(isValidPostalCode(value)).toBe(false);
      expect(validatePostalCode(value).isValid).toBe(false);
    },
  );
  it('preserves postal padding', () => {
    expect(lookupPostalCode(' 100 ')?.code).toBe('00100');
    expect(lookupPostalCode(100)?.code).toBe('00100');
  });
});

describe('currency correctness', () => {
  it.each([
    Infinity,
    -Infinity,
    NaN,
    '9'.repeat(400),
    '1,2,3',
    '12,345,67',
    '1,,000',
    '1Rs2',
    'Rs Rs 1',
    'Rs 1 LKR',
    '(500',
    '500)',
    '(-500)',
    '--500',
    '1e3',
    '1.2.3',
    MAX_LKR_AMOUNT * 2,
  ])('rejects malformed or out-of-range amount %#', (value) => {
    expect(parseLKR(value)).toBeNull();
    expect(isValidLKR(value, { allowNegative: true })).toBe(false);
    expect(validateLKR(value, { allowNegative: true }).isValid).toBe(false);
  });
  it.each([
    ['1,234,567.89', 1234567.89],
    ['12,34,567.89', 1234567.89],
    ['500 LKR', 500],
    ['(Rs. 500)', -500],
    ['-Rs. 500', -500],
    ['1.005', 1.005],
  ])('parses supported amount %s', (value, expected) => {
    expect(parseLKR(value)).toBe(expected);
  });
  it('rounds cents with carry, including decimal ties and negative values', () => {
    expect(lkrToWords(1.999)).toBe('Two Rupees Only');
    expect(lkrToWords(-1.999)).toBe('Minus Two Rupees Only');
    expect(lkrToWords(1.005)).toBe('One Rupee and One Cent Only');
    expect(lkrToWords(0.005)).toBe('Zero Rupees and One Cent Only');
    expect(lkrToWords(1e-7)).toBe('Zero Rupees Only');
    expect(lkrToWords(1.999, { includeCents: false })).toBe('Two Rupees Only');
  });
  it.each(['en', 'si', 'ta'] as const)('enforces word scale and rounding for %s', (language) => {
    const limit = language === 'en' ? 1e12 : 1e9;
    expect(() => lkrToWords(limit, { language })).toThrow(RangeError);
    expect(() => lkrToWords(limit - 0.001, { language })).toThrow(RangeError);
    expect(lkrToWords(limit - 1, { language })).not.toContain('undefined');
    expect(lkrToWords(1.999, { language })).toBe(lkrToWords(2, { language }));
    for (const value of [NaN, Infinity, -Infinity]) {
      expect(() => lkrToWords(value, { language })).toThrow(RangeError);
    }
  });
});

describe('DOB options and schema data', () => {
  it.each<DobOptions>([
    { referenceDate: new Date(NaN), minAge: 100 },
    { minAge: NaN },
    { maxAge: Infinity },
    { minAge: -1 },
    { maxAge: 18.5 },
    { minAge: 30, maxAge: 20 },
    { referenceDate: '2025-01-01' as unknown as Date },
  ])('rejects invalid DOB options %#', (options) => {
    expect(isValidDob('2000-01-01', options)).toBe(false);
    expect(validateDob('2000-01-01', options).code).toBe('DOB_INVALID_OPTIONS');
  });
  it('returns null for an invalid age reference', () => {
    expect(calculateAge('2000-01-01', new Date(NaN))).toBeNull();
  });
  it.each([null, undefined, [], 'data', 1, true, new Date()])(
    'rejects invalid schema root %#',
    (data) => {
      const result = createSchemaValidator().validate(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.$root).toBe('Expected a form data object.');
      expect(result.errorList).toHaveLength(1);
    },
  );
  it('retains special field errors in both representations and JSON', () => {
    const validator = createSchemaValidator();
    for (const field of ['__proto__', 'constructor', 'toString'])
      validator.field(field, () => false);
    const result = validator.validate({});
    expect(result.isValid).toBe(false);
    expect(Object.getPrototypeOf(result.errors)).toBeNull();
    for (const { field, message } of result.errorList) {
      expect(Object.hasOwn(result.errors, field)).toBe(true);
      expect((JSON.parse(JSON.stringify(result.errors)) as Record<string, string>)[field]).toBe(
        message,
      );
    }
  });
  it('validates null-prototype records and treats inherited fields as absent', () => {
    const validator = createSchemaValidator({ toString: (value: unknown) => value === undefined });
    expect(validator.validate({}).isValid).toBe(true);
    expect(validator.validate(Object.create(null)).isValid).toBe(true);
  });
});
