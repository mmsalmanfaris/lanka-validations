import { describe, expect, it } from 'vitest';
import { calculateAge, isValidDob, matchesNicDob, parseDob, validateDob } from '../src/dob';

describe('DOB Module', () => {
  it('parses various date formats (ISO, slash, DD-MM-YYYY)', () => {
    const d1 = parseDob('1995-05-20');
    expect(d1?.getUTCFullYear()).toBe(1995);
    expect(d1?.getUTCMonth()).toBe(4); // May
    expect(d1?.getUTCDate()).toBe(20);

    const d2 = parseDob('20/05/1995');
    expect(d2?.getUTCFullYear()).toBe(1995);

    const d3 = parseDob(new Date(Date.UTC(1995, 4, 20)));
    expect(d3?.getUTCFullYear()).toBe(1995);
  });

  it('calculates age correctly', () => {
    const ref = new Date(Date.UTC(2025, 0, 1)); // 2025-01-01
    expect(calculateAge('2000-01-01', ref)).toBe(25);
    expect(calculateAge('2000-05-01', ref)).toBe(24);
  });

  it('validates DOB with minAge and maxAge', () => {
    const ref = new Date(Date.UTC(2025, 0, 1));
    expect(isValidDob('2000-01-01', { referenceDate: ref, minAge: 18 })).toBe(true);
    expect(isValidDob('2015-01-01', { referenceDate: ref, minAge: 18 })).toBe(false);
  });

  it('rejects future dates', () => {
    const futureDate = new Date(Date.now() + 86400000 * 30);
    expect(isValidDob(futureDate)).toBe(false);
  });

  it('matches DOB with Sri Lankan NIC', () => {
    // 921234567V -> 1992-05-02
    expect(matchesNicDob('1992-05-02', '921234567V')).toBe(true);
    expect(matchesNicDob('1992-05-03', '921234567V')).toBe(false);
  });

  it('returns structured validation result', () => {
    const res = validateDob('1992-05-02');
    expect(res.isValid).toBe(true);
    expect(res.data?.isoDate).toBe('1992-05-02');

    const err = validateDob('invalid');
    expect(err.isValid).toBe(false);
    expect(err.code).toBe('DOB_INVALID');
  });
});
