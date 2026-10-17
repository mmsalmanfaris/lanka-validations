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

  it('rejects an invalid Date object', () => {
    expect(parseDob(new Date(NaN))).toBeNull();
  });

  it('calculates age correctly', () => {
    const ref = new Date(Date.UTC(2025, 0, 1)); // 2025-01-01
    expect(calculateAge('2000-01-01', ref)).toBe(25);
    expect(calculateAge('2000-05-01', ref)).toBe(24);
    expect(calculateAge('invalid', ref)).toBeNull();
  });

  it('calculates age against today when no reference date is given', () => {
    expect(calculateAge('2000-01-01')).toBeGreaterThanOrEqual(26);
  });

  it('validates DOB with minAge and maxAge', () => {
    const ref = new Date(Date.UTC(2025, 0, 1));
    expect(isValidDob('2000-01-01', { referenceDate: ref, minAge: 18 })).toBe(true);
    expect(isValidDob('2015-01-01', { referenceDate: ref, minAge: 18 })).toBe(false);
    expect(isValidDob('2000-01-01', { referenceDate: ref, maxAge: 30 })).toBe(true);
    expect(isValidDob('1990-01-01', { referenceDate: ref, maxAge: 30 })).toBe(false);
  });

  it('rejects dates beyond a realistic human lifespan', () => {
    const ref = new Date(Date.UTC(2025, 0, 1));
    expect(isValidDob('1800-01-01', { referenceDate: ref })).toBe(false);
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

  it('does not match when either the DOB or the NIC is invalid', () => {
    expect(matchesNicDob('invalid', '921234567V')).toBe(false);
    expect(matchesNicDob('1992-05-02', 'invalid')).toBe(false);
  });

  it('returns structured validation result', () => {
    const res = validateDob('1992-05-02');
    expect(res.isValid).toBe(true);
    expect(res.data?.isoDate).toBe('1992-05-02');

    const err = validateDob('invalid');
    expect(err.isValid).toBe(false);
    expect(err.code).toBe('DOB_INVALID');
  });

  it('returns age limit errors in the validation result', () => {
    const ref = new Date(Date.UTC(2025, 0, 1));

    const tooOld = validateDob('1800-01-01', { referenceDate: ref });
    expect(tooOld.code).toBe('DOB_TOO_OLD');

    const belowMin = validateDob('2015-01-01', { referenceDate: ref, minAge: 18 });
    expect(belowMin.code).toBe('DOB_BELOW_MIN_AGE');
    expect(belowMin.error).toBe('Age 10 is below minimum required age of 18.');

    const aboveMax = validateDob('1990-01-01', { referenceDate: ref, maxAge: 30 });
    expect(aboveMax.code).toBe('DOB_EXCEEDS_MAX_AGE');
    expect(aboveMax.error).toBe('Age 35 exceeds maximum allowed age of 30.');
  });
});
