import { describe, expect, it } from 'vitest';
import {
  localizeSchemaResult,
  localizeValidationResult,
  translateValidationCode,
  VALIDATION_MESSAGES,
} from '../src/i18n';
import { validateNic } from '../src/nic';
import { createSchemaValidator, rules } from '../src/schema';

describe('localized validation messages', () => {
  it('provides every catalog entry in all supported locales', () => {
    for (const messages of Object.values(VALIDATION_MESSAGES)) {
      expect(messages.en).toBeTruthy();
      expect(messages.si).toBeTruthy();
      expect(messages.ta).toBeTruthy();
    }
  });

  it('keeps stable codes and supports application overrides', () => {
    const result = localizeValidationResult(validateNic('bad'), 'si');
    expect(result.isValid).toBe(false);
    if (!result.isValid) expect(result.code).toBe('NIC_INVALID_FORMAT');
    expect(
      translateValidationCode('NIC_INVALID_FORMAT', 'ta', { NIC_INVALID_FORMAT: 'Custom' }),
    ).toBe('Custom');
  });

  it('falls back to the generic message for unknown codes', () => {
    expect(translateValidationCode('NOT_A_CODE', 'si')).toBe(
      VALIDATION_MESSAGES.VALIDATION_FAILED!.si,
    );
    expect(translateValidationCode('NOT_A_CODE')).toBe('Validation failed.');
  });

  it('returns successful results unchanged', () => {
    const success = validateNic('921234567V');

    expect(localizeValidationResult(success, 'ta')).toBe(success);
  });

  it('localizes every schema error while keeping fields and codes', () => {
    const original = createSchemaValidator({ nic: rules.nic(), name: rules.required() }).validate({
      nic: 'bad',
    });

    const result = localizeSchemaResult(original, 'ta', { REQUIRED: 'Custom required' });

    expect(result.isValid).toBe(false);
    expect(result.errors.nic).toBe(VALIDATION_MESSAGES.NIC_INVALID_FORMAT!.ta);
    expect(result.errors.name).toBe('Custom required');
    expect(result.errorList.map(({ field, code }) => [field, code])).toEqual([
      ['nic', 'NIC_INVALID_FORMAT'],
      ['name', 'REQUIRED'],
    ]);
    expect(result.errorCodes).toEqual(original.errorCodes);
    expect(original.errors.name).toBe('This field is required.');
  });
});
