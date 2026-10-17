import { describe, expect, it } from 'vitest';
import { isValidPassport, parsePassport, validatePassport } from '../src/passport';

describe('Passport Module', () => {
  it('validates regular MRP passport (N, M, L)', () => {
    expect(isValidPassport('N1234567')).toBe(true);
    expect(isValidPassport('M7654321')).toBe(true);
    expect(isValidPassport('L1122334')).toBe(true);

    const parsed = parsePassport('N1234567');
    expect(parsed?.type).toBe('ordinary');
    expect(parsed?.prefix).toBe('N');
    expect(parsed?.number).toBe('1234567');
    expect(parsed?.isEPassport).toBe(false);
  });

  it('validates diplomatic (D) and official (O) passports', () => {
    expect(isValidPassport('D1234567')).toBe(true);
    expect(parsePassport('D1234567')?.type).toBe('diplomatic');

    expect(isValidPassport('O7654321')).toBe(true);
    expect(parsePassport('O7654321')?.type).toBe('official');
  });

  it('validates new e-Passport formats (PA, P)', () => {
    expect(isValidPassport('PA1234567')).toBe(true);
    expect(parsePassport('PA1234567')?.isEPassport).toBe(true);

    expect(isValidPassport('P1234567')).toBe(true);
  });

  it('classifies e-Passport prefixes (D, O, E, unknown)', () => {
    const diplomatic = parsePassport('D12345678');
    expect(diplomatic?.type).toBe('diplomatic');
    expect(diplomatic?.prefix).toBe('D');
    expect(diplomatic?.number).toBe('12345678');
    expect(diplomatic?.isEPassport).toBe(true);

    expect(parsePassport('O12345678')?.type).toBe('official');

    const emergency = parsePassport('E1234567');
    expect(emergency?.type).toBe('emergency');
    expect(emergency?.isEPassport).toBe(true);

    expect(isValidPassport('XY1234567')).toBe(true);
    expect(parsePassport('XY1234567')?.type).toBe('unknown');
  });

  it('rejects invalid passports', () => {
    expect(isValidPassport('')).toBe(false);
    expect(isValidPassport('1234567')).toBe(false);
    expect(isValidPassport('N12345')).toBe(false);
    expect(isValidPassport('INVALID_PASS')).toBe(false);
  });

  it('returns structured validation result', () => {
    expect(validatePassport('N1234567').isValid).toBe(true);
    expect(validatePassport('').isValid).toBe(false);
    expect(validatePassport('').code).toBe('PASSPORT_REQUIRED');
  });
});
