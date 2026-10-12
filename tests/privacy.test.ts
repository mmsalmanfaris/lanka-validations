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
    expect(validationResultForLog(result)).toEqual({ isValid: false, code: result.isValid ? undefined : result.code });
    expect(JSON.stringify(validationResultForLog(result))).not.toContain('invalid');
  });
});
