import { describe, expect, it } from 'vitest';
import {
  parseDob, validateDob, isValidDob, calculateAge,
  parseNic, validateNic, isValidNic, isValidNewNic, isValidOldNic, parseNicDayOfYear,
  getBankByCode, getBankList, validateBankAccount, isValidBankCode, CBSL_BANKS,
  getProvinceInfo, getProvinces, getDistrictInfo, getDistricts, PROVINCES, DISTRICTS,
  cleanString, MAX_INPUT_LENGTH, parsePhone, parseLKR, lookupPostalCode,
} from '../src';

describe('strict UTC date-only parsing', () => {
  it.each(['2000-02-29', '2000/02/29', '29-02-2000', '29/02/2000'])(
    'accepts documented format %s', value => {
      expect(parseDob(value)?.toISOString()).toBe('2000-02-29T00:00:00.000Z');
    },
  );
  it.each(['2001-02-29', '2024-04-31', '2024-00-01', '2024-01-00',
    '2024-02/29', '29/02-2024', '2024-2-9', 'Feb 29, 2024', '2024',
    '2024-02-29T00:00:00Z', '2024-02-29T12:00:00+05:30', 2000, 0])(
    'rejects non-calendar or undocumented format %s', value => {
      expect(parseDob(value)).toBeNull();
      expect(isValidDob(value)).toBe(false);
      expect(validateDob(value).code).toBe('DOB_INVALID');
    },
  );
  it('uses the UTC day of Date objects and returns a detached midnight value', () => {
    const original = new Date('2024-03-01T01:00:00+05:30');
    const parsed = parseDob(original)!;
    expect(parsed.toISOString()).toBe('2024-02-29T00:00:00.000Z');
    expect(original.toISOString()).toBe('2024-02-29T19:30:00.000Z');
    parsed.setUTCFullYear(1999);
    expect(original.getUTCFullYear()).toBe(2024);
  });
  it('allows today regardless of the input time and computes UTC birthdays', () => {
    const referenceDate = new Date('2024-03-01T00:00:00Z');
    expect(isValidDob(new Date('2024-03-01T23:00:00Z'), { referenceDate })).toBe(true);
    expect(calculateAge('2000-03-01', referenceDate)).toBe(24);
    expect(calculateAge('2000-03-02', referenceDate)).toBe(23);
  });
});

describe('deterministic NIC dates', () => {
  const nic = '202406104567'; // legacy table: March 1
  it('rejects same-year future DOBs and accepts birth date itself', () => {
    const before = { referenceDate: new Date('2024-02-29T23:59:59Z') };
    const birthday = { referenceDate: new Date('2024-03-01T00:00:00Z') };
    expect(parseNic(nic, before)).toBeNull();
    expect(isValidNic(nic, before)).toBe(false);
    expect(validateNic(nic, before).code).toBe('NIC_FUTURE_DOB');
    expect(parseNic(nic, birthday)?.age).toBe(0);
    expect(isValidNewNic(nic, birthday)).toBe(true);
    expect(validateNic(nic, birthday).isValid).toBe(true);
  });
  it('uses UTC at year boundaries', () => {
    const opts = { referenceDate: new Date('2025-01-01T01:00:00+05:30') };
    expect(validateNic('202500104567', opts).code).toBe('NIC_INVALID_YEAR');
    expect(parseNic('200000104567', opts)?.age).toBe(24);
    expect(isValidOldNic('000014567V', opts)).toBe(true);
  });
  it('rejects an invalid reference date', () => {
    const opts = { referenceDate: new Date(NaN) };
    expect(parseNic(nic, opts)).toBeNull();
    expect(validateNic(nic, opts).code).toBe('NIC_INVALID_OPTIONS');
  });
  it('preserves the unverified legacy non-leap day-60 rule explicitly', () => {
    expect(parseNicDayOfYear(2001, 60)).toEqual({ month: 2, day: 28 });
    expect(parseNicDayOfYear(2000, 60)).toEqual({ month: 2, day: 29 });
    expect(parseNicDayOfYear(2001, 61)).toEqual({ month: 3, day: 1 });
    expect(parseNicDayOfYear(2001, NaN)).toBeNull();
    expect(parseNicDayOfYear(2001, 60.5)).toBeNull();
  });
});

describe('reference data isolation', () => {
  it('keeps bank records isolated across lookup, list, and validation', () => {
    getBankByCode('7010')!.name = 'changed';
    getBankList()[0].name = 'changed';
    validateBankAccount('12345678', '7010').data!.bank!.name = 'changed';
    expect(getBankByCode('7010')!.name).toBe('Bank of Ceylon');
    expect(isValidBankCode('__proto__')).toBe(false);
    expect(isValidBankCode('constructor')).toBe(false);
    expect(Object.isFrozen(CBSL_BANKS)).toBe(true);
    expect(Object.isFrozen(CBSL_BANKS['7010'])).toBe(true);
    expect(Reflect.set(CBSL_BANKS, '9999', CBSL_BANKS['7010'])).toBe(false);
    expect(Reflect.set(CBSL_BANKS['7010'], 'name', 'changed')).toBe(false);
  });
  it('copies nested province lists and district records', () => {
    getProvinceInfo('WP')!.districts.push('changed');
    getProvinces()[0].districts.length = 0;
    getProvinces().length = 0;
    getDistrictInfo('Colombo')!.name = 'changed';
    getDistricts()[0].name = 'changed';
    expect(getProvinceInfo('WP')!.districts).toEqual(['Colombo', 'Gampaha', 'Kalutara']);
    expect(getProvinces()).toHaveLength(9);
    expect(getDistrictInfo('Colombo')!.name).toBe('Colombo');
    expect(getDistricts()).toHaveLength(25);
    expect(Object.isFrozen(PROVINCES)).toBe(true);
    expect(Object.isFrozen(PROVINCES[0])).toBe(true);
    expect(Object.isFrozen(PROVINCES[0].districts)).toBe(true);
    expect(Object.isFrozen(DISTRICTS)).toBe(true);
    expect(Object.isFrozen(DISTRICTS[0])).toBe(true);
  });
});

describe('bounded normalization', () => {
  it('checks raw size before whitespace or zero-width characters are removed', () => {
    expect(cleanString('x'.repeat(MAX_INPUT_LENGTH))).toHaveLength(MAX_INPUT_LENGTH);
    expect(cleanString('x'.repeat(MAX_INPUT_LENGTH + 1))).toBe('');
    for (const padding of [' ', '\u200B']) {
      const prefix = padding.repeat(MAX_INPUT_LENGTH);
      expect(parseNic(prefix + '921234567V')).toBeNull();
      expect(parsePhone(prefix + '0771234567')).toBeNull();
      expect(parseLKR(prefix + '123')).toBeNull();
      expect(parseDob(prefix + '2000-01-01')).toBeNull();
      expect(lookupPostalCode(prefix + '20000')).toBeNull();
      expect(getBankByCode(prefix + '7010')).toBeNull();
      expect(getProvinceInfo(prefix + 'WP')).toBeNull();
    }
  });
});
