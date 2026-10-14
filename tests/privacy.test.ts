import { describe, expect, it } from 'vitest';
import {
  maskBankAccount,
  maskNic,
  maskPhone,
  redactSensitiveValue,
  validationResultForLog,
} from '../src/privacy';
import { validateNic } from '../src/nic';

describe('privacy helpers', () => {
  it('masks supported identifiers without retaining the complete value', () => {
    expect(maskNic('921234567V')).toBe('******567V');
    expect(maskPhone('0771234567')).toBe('******4567');
    expect(maskPhone('119')).toBe('***');
    expect(maskBankAccount('1234-5678')).toBe('****5678');
  });

  it('rejects invalid JSON-shaped inputs without coercion', () => {
    expect(maskNic({ toString: null })).toBeNull();
    expect(maskPhone(['0771234567'])).toBeNull();
    expect(maskBankAccount({ account: '12345678' })).toBeNull();
  });

  it('redacts arbitrary values and emits code-only validation logs', () => {
    expect(redactSensitiveValue('921234567V')).toBe('[REDACTED]');
    const result = validateNic('invalid');
    expect(validationResultForLog(result)).toEqual({
      isValid: false,
      code: result.isValid ? undefined : result.code,
    });
    expect(JSON.stringify(validationResultForLog(result))).not.toContain('invalid');
  });

  it.each([0, -1, -100, Number.NaN, Number.NEGATIVE_INFINITY])(
    'never reveals digits when visibleDigits is %s',
    (visibleDigits) => {
      expect(maskNic('921234567V', visibleDigits)).toBe('**********');
      expect(maskPhone('0771234567', visibleDigits)).toBe('**********');
      expect(maskBankAccount('1234567890', visibleDigits)).toBe('**********');
    },
  );

  it('rounds fractional visibleDigits down and caps at the value length', () => {
    expect(maskNic('921234567V', 2.9)).toBe('********7V');
    expect(maskNic('921234567V', Number.POSITIVE_INFINITY)).toBe('**********');
    expect(maskNic('921234567V', 99)).toBe('921234567V');
  });
});
