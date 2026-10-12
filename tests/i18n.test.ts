import { describe, expect, it } from 'vitest';
import { localizeValidationResult, translateValidationCode, VALIDATION_MESSAGES } from '../src/i18n';
import { validateNic } from '../src/nic';

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
    expect(translateValidationCode('NIC_INVALID_FORMAT', 'ta', { NIC_INVALID_FORMAT: 'Custom' })).toBe('Custom');
  });
});
