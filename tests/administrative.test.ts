import { describe, expect, it } from 'vitest';
import {
  getDistrictInfo,
  getDistricts,
  getProvinceInfo,
  getProvinces,
  isValidDistrict,
  isValidProvince,
} from '../src/administrative';

describe('Administrative Divisions Module', () => {
  it('validates provinces by code, English, Sinhala, and Tamil names', () => {
    expect(isValidProvince('WP')).toBe(true);
    expect(isValidProvince('Western')).toBe(true);
    expect(isValidProvince('බස්නාහිර')).toBe(true);
    expect(isValidProvince('மேல்')).toBe(true);
    expect(isValidProvince('Unknown')).toBe(false);

    const wp = getProvinceInfo('WP');
    expect(wp?.name).toBe('Western');
    expect(wp?.districts).toContain('Colombo');
  });

  it('validates districts by English, Sinhala, and Tamil names', () => {
    expect(isValidDistrict('Colombo')).toBe(true);
    expect(isValidDistrict('කොළඹ')).toBe(true);
    expect(isValidDistrict('கொழும்பு')).toBe(true);
    expect(isValidDistrict('Kandy')).toBe(true);
    expect(isValidDistrict('Galle')).toBe(true);
    expect(isValidDistrict('Jaffna')).toBe(true);
    expect(isValidDistrict('InvalidCity')).toBe(false);

    const colombo = getDistrictInfo('Colombo');
    expect(colombo?.provinceCode).toBe('WP');
    expect(colombo?.provinceName).toBe('Western');
  });

  it('returns all 9 provinces and 25 districts', () => {
    expect(getProvinces().length).toBe(9);
    expect(getDistricts().length).toBe(25);
  });
});
