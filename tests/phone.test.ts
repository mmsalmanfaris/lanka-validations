import { describe, expect, it } from 'vitest';
import {
  formatPhone,
  isValidLandline,
  isValidMobile,
  isValidPhone,
  isValidShortCode,
  parsePhone,
  validatePhone,
} from '../src/phone';

describe('Phone Module', () => {
  describe('Mobile Numbers', () => {
    it('validates Dialog numbers (077, 076, 074)', () => {
      expect(isValidMobile('0771234567')).toBe(true);
      expect(isValidMobile('0761234567')).toBe(true);
      expect(isValidMobile('0741234567')).toBe(true);

      const parsed = parsePhone('0771234567');
      expect(parsed?.operator).toBe('Dialog');
      expect(parsed?.type).toBe('mobile');
      expect(parsed?.e164).toBe('+94771234567');
      expect(parsed?.national).toBe('077 123 4567');
    });

    it('validates Mobitel numbers (071, 070)', () => {
      expect(isValidMobile('0711234567')).toBe(true);
      expect(isValidMobile('0701234567')).toBe(true);

      const parsed = parsePhone('0711234567');
      expect(parsed?.operator).toBe('Mobitel');
    });

    it('validates Hutch and Airtel numbers (078, 072, 075)', () => {
      expect(isValidMobile('0781234567')).toBe(true);
      expect(isValidMobile('0721234567')).toBe(true);
      expect(isValidMobile('0751234567')).toBe(true);

      expect(parsePhone('0781234567')?.operator).toBe('Hutch');
      expect(parsePhone('0751234567')?.operator).toBe('Airtel');
    });

    it('accepts various input formats: +94, 0094, spaces, dashes', () => {
      expect(isValidPhone('+94 77 123 4567')).toBe(true);
      expect(isValidPhone('+94771234567')).toBe(true);
      expect(isValidPhone('0094771234567')).toBe(true);
      expect(isValidPhone('94771234567')).toBe(true);
      expect(isValidPhone('077-123-4567')).toBe(true);
      expect(isValidPhone('(077) 123 4567')).toBe(true);
    });
  });

  describe('Landline Numbers', () => {
    it('validates Colombo landline (011) and identifies SLT operator', () => {
      expect(isValidLandline('0112345678')).toBe(true);
      expect(isValidMobile('0112345678')).toBe(false);

      const parsed = parsePhone('0112345678');
      expect(parsed?.type).toBe('fixed');
      expect(parsed?.areaName).toBe('Colombo');
      expect(parsed?.district).toBe('Colombo');
      expect(parsed?.operator).toBe('SLT');
    });

    it('validates Kandy landline (081) with Dialog operator', () => {
      const parsed = parsePhone('0814345678');
      expect(parsed?.type).toBe('fixed');
      expect(parsed?.areaName).toBe('Kandy');
      expect(parsed?.district).toBe('Kandy');
      expect(parsed?.operator).toBe('Dialog Broadband');
    });

    it('validates Galle landline (091)', () => {
      const parsed = parsePhone('0912223344');
      expect(parsed?.type).toBe('fixed');
      expect(parsed?.district).toBe('Galle');
    });
  });

  describe('Emergency & Short Codes', () => {
    it('validates 119 and 1990', () => {
      expect(isValidShortCode('119')).toBe(true);
      expect(isValidShortCode('1990')).toBe(true);
      expect(isValidShortCode('110')).toBe(true);
      expect(isValidShortCode('1919')).toBe(true);

      const parsed119 = parsePhone('119');
      expect(parsed119?.type).toBe('short_code');
    });
  });

  describe('Formatter', () => {
    it('formats into national, e164, and international', () => {
      expect(formatPhone('0771234567', 'e164')).toBe('+94771234567');
      expect(formatPhone('0771234567', 'national')).toBe('077 123 4567');
      expect(formatPhone('0771234567', 'international')).toBe('+94 77 123 4567');
    });
  });

  describe('Validation result and errors', () => {
    it('returns error on empty or invalid phone', () => {
      expect(validatePhone('').isValid).toBe(false);
      expect(validatePhone('1234').isValid).toBe(false);
      expect(validatePhone('0771234567').isValid).toBe(true);
    });
  });
});

