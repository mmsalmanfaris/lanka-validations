import { describe, expect, it } from 'vitest';
import {
  getAllLicenseCategories,
  getLicenseCategoryInfo,
  isValidDrivingLicense,
  isValidLicenseCategory,
  parseDrivingLicense,
  validateDrivingLicense,
} from '../src/license';

describe('Driving License Module', () => {
  it('validates standard DMT B-number driving license (B + 7 digits)', () => {
    expect(isValidDrivingLicense('B1234567')).toBe(true);
    expect(isValidDrivingLicense('b1234567')).toBe(true);

    const parsed = parseDrivingLicense('B1234567');
    expect(parsed?.format).toBe('smart_card_b');
    expect(parsed?.number).toBe('1234567');
  });

  it('validates 7-digit legacy driving license', () => {
    expect(isValidDrivingLicense('1234567')).toBe(true);
    const parsed = parseDrivingLicense('1234567');
    expect(parsed?.format).toBe('legacy');
    expect(parsed?.license).toBe('B1234567');
  });

  it('validates NIC-based smart card driving license', () => {
    expect(isValidDrivingLicense('921234567V')).toBe(true);
    expect(isValidDrivingLicense('199212304567')).toBe(true);

    const parsed = parseDrivingLicense('921234567V');
    expect(parsed?.format).toBe('nic_based');
    expect(parsed?.nicFormat).toBe('old');
  });

  it('validates DMT vehicle license categories', () => {
    expect(isValidLicenseCategory('A')).toBe(true);
    expect(isValidLicenseCategory('B')).toBe(true);
    expect(isValidLicenseCategory('B1')).toBe(true);
    expect(isValidLicenseCategory('C1')).toBe(true);
    expect(isValidLicenseCategory('X')).toBe(false);

    const catB1 = getLicenseCategoryInfo('B1');
    expect(catB1?.name).toBe('Motor Tricycle');
    expect(catB1?.minAge).toBe(18);

    const all = getAllLicenseCategories();
    expect(all.length).toBeGreaterThanOrEqual(13);
  });

  it('returns structured validation result', () => {
    expect(validateDrivingLicense('B1234567').isValid).toBe(true);
    expect(validateDrivingLicense('').isValid).toBe(false);
    expect(validateDrivingLicense('').code).toBe('LICENSE_REQUIRED');
  });

  it('returns null when parsing an empty license number', () => {
    expect(parseDrivingLicense('')).toBeNull();
    expect(parseDrivingLicense(' - ')).toBeNull();
  });
});
