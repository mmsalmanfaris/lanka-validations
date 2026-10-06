import { describe, expect, it } from 'vitest';
import {
  isValidGender,
  matchesNicGender,
  normalizeGender,
  validateGender,
} from '../src/gender';

describe('Gender Module', () => {
  it('normalizes English variations', () => {
    expect(normalizeGender('male')).toBe('male');
    expect(normalizeGender('M')).toBe('male');
    expect(normalizeGender('female')).toBe('female');
    expect(normalizeGender('F')).toBe('female');
  });

  it('normalizes Sinhala variations', () => {
    expect(normalizeGender('පිරිමි')).toBe('male');
    expect(normalizeGender('පුරුෂ')).toBe('male');
    expect(normalizeGender('ගැහැණු')).toBe('female');
    expect(normalizeGender('ස්ත්‍රී')).toBe('female');
  });

  it('normalizes Tamil variations', () => {
    expect(normalizeGender('ஆண்')).toBe('male');
    expect(normalizeGender('பெண்')).toBe('female');
  });

  it('validates gender correctly', () => {
    expect(isValidGender('male')).toBe(true);
    expect(isValidGender('female')).toBe(true);
    expect(isValidGender('පිරිමි')).toBe(true);
    expect(isValidGender('பெண்')).toBe(true);
    expect(isValidGender('invalid')).toBe(false);
  });

  it('matches gender with Sri Lankan NIC', () => {
    // 921234567V -> days 123 <= 500 -> male
    expect(matchesNicGender('male', '921234567V')).toBe(true);
    expect(matchesNicGender('female', '921234567V')).toBe(false);

    // 856234567X -> days 623 > 500 -> female
    expect(matchesNicGender('female', '856234567X')).toBe(true);
    expect(matchesNicGender('male', '856234567X')).toBe(false);
  });

  it('returns structured validation result', () => {
    expect(validateGender('male').isValid).toBe(true);
    expect(validateGender('unknown').isValid).toBe(false);
    expect(validateGender('unknown').code).toBe('GENDER_INVALID');
  });
});
