import { describe, expect, it } from 'vitest';
import {
  convertNewToOldNic,
  convertOldToNewNic,
  formatNic,
  isValidNewNic,
  isValidNic,
  isValidOldNic,
  parseNic,
  validateNic,
} from '../src/nic';

describe('NIC Module', () => {
  describe('Old NIC (9 digits + V/X)', () => {
    it('validates a male old NIC', () => {
      // 921234567V -> Year 1992, Day 123 (May 2)
      expect(isValidNic('921234567V')).toBe(true);
      expect(isValidOldNic('921234567V')).toBe(true);
      expect(isValidNewNic('921234567V')).toBe(false);

      const parsed = parseNic('921234567V');
      expect(parsed).not.toBeNull();
      expect(parsed?.format).toBe('old');
      expect(parsed?.year).toBe(1992);
      expect(parsed?.gender).toBe('male');
      expect(parsed?.dayOfYear).toBe(123);
      expect(parsed?.dobString).toBe('1992-05-02');
      expect(parsed?.isVoter).toBe(true);
      expect(parsed?.checkDigit).toBe(7);
      expect(parsed?.serial).toBe('456');
    });

    it('validates a female old NIC with day offset > 500', () => {
      // 856234567X -> Year 1985, Day 623 (123 for female -> May 3)
      expect(isValidNic('856234567X')).toBe(true);
      const parsed = parseNic('856234567x');
      expect(parsed).not.toBeNull();
      expect(parsed?.gender).toBe('female');
      expect(parsed?.dayOfYear).toBe(123);
      expect(parsed?.isVoter).toBe(false);
    });

    it('handles lowercase letter suffix and whitespace', () => {
      expect(isValidNic(' 921234567v ')).toBe(true);
    });
  });

  describe('New NIC (12 digits)', () => {
    it('validates a male new NIC', () => {
      // 199212304567 -> 1992, Day 123, Serial 0456, Check 7
      expect(isValidNic('199212304567')).toBe(true);
      expect(isValidNewNic('199212304567')).toBe(true);
      expect(isValidOldNic('199212304567')).toBe(false);

      const parsed = parseNic('199212304567');
      expect(parsed).not.toBeNull();
      expect(parsed?.format).toBe('new');
      expect(parsed?.year).toBe(1992);
      expect(parsed?.gender).toBe('male');
      expect(parsed?.dayOfYear).toBe(123);
      expect(parsed?.dobString).toBe('1992-05-02');
      expect(parsed?.isVoter).toBeNull();
    });

    it('validates a female new NIC born after 2000', () => {
      // 200162301234 -> 2001, Day 623 (female 123 -> May 3)
      expect(isValidNic('200162301234')).toBe(true);
      const parsed = parseNic('200162301234');
      expect(parsed).not.toBeNull();
      expect(parsed?.year).toBe(2001);
      expect(parsed?.gender).toBe('female');
    });
  });

  describe('NIC Conversion', () => {
    it('converts old NIC to new NIC', () => {
      expect(convertOldToNewNic('921234567V')).toBe('199212304567');
      expect(convertOldToNewNic('856234567X')).toBe('198562304567');
    });

    it('converts new NIC back to old NIC for 1900s births with 0-prefixed serial', () => {
      expect(convertNewToOldNic('199212304567')).toBe('921234567V');
      expect(convertNewToOldNic('199212304567', { isVoter: false })).toBe('921234567X');
    });

    it('returns null when converting new NIC from year 2000+ to old NIC', () => {
      expect(convertNewToOldNic('200162301234')).toBeNull();
    });
  });

  describe('NIC Formatter', () => {
    it('formats old and new NICs correctly', () => {
      expect(formatNic('921234567v')).toBe('921234567V');
      expect(formatNic('921234567v', 'spaced-old')).toBe('92123 456 7V');
      expect(formatNic('199212304567', 'spaced-new')).toBe('1992 123 0456 7');
    });
  });

  describe('NIC Validation Result & Errors', () => {
    it('returns structured success', () => {
      const res = validateNic('921234567V');
      expect(res.isValid).toBe(true);
      expect(res.data?.year).toBe(1992);
    });

    it('returns error on empty NIC', () => {
      const res = validateNic('');
      expect(res.isValid).toBe(false);
      expect(res.code).toBe('NIC_REQUIRED');
    });

    it('returns error on invalid format', () => {
      const res = validateNic('12345');
      expect(res.isValid).toBe(false);
      expect(res.code).toBe('NIC_INVALID_FORMAT');
    });

    it('returns error on invalid day number', () => {
      // Day 999 is invalid (> 866)
      const res = validateNic('929994567V');
      expect(res.isValid).toBe(false);
      expect(res.code).toBe('NIC_INVALID_DAY');
    });
  });
});
