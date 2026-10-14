import { cleanString } from '../common/utils';
import { DISTRICTS, PROVINCES } from './data';
import type { DistrictInfo, ProvinceInfo } from './types';

const PROVINCE_INDEX = new Map<string, (typeof PROVINCES)[number]>();
for (const province of PROVINCES) {
  for (const alias of [province.code, province.name, province.nameSi, province.nameTa]) {
    PROVINCE_INDEX.set(alias.toLowerCase(), province);
  }
}

const DISTRICT_INDEX = new Map<string, (typeof DISTRICTS)[number]>();
for (const district of DISTRICTS) {
  for (const alias of [district.name, district.nameSi, district.nameTa]) {
    DISTRICT_INDEX.set(alias.toLowerCase(), district);
  }
}

/**
 * Validates whether the given string is a valid Sri Lankan province name, Sinhala/Tamil name, or province code (e.g. 'WP', 'Western', 'බස්නාහිර').
 *
 * @param p - Province code or name in English, Sinhala, or Tamil.
 * @returns `true` if the province is recognised.
 *
 * @example
 * ```ts
 * isValidProvince('Western'); // true
 * isValidProvince('WP'); // true
 * isValidProvince('Unknown'); // false
 * ```
 */
export function isValidProvince(p: unknown): boolean {
  const cleaned = cleanString(p).toLowerCase();
  return cleaned !== '' && PROVINCE_INDEX.has(cleaned);
}

/**
 * Validates whether the given string is a valid Sri Lankan district name, Sinhala name, or Tamil name (e.g. 'Colombo', 'කොළඹ', 'கொழும்பு').
 *
 * @param d - District name in English, Sinhala, or Tamil.
 * @returns `true` if the district is recognised.
 *
 * @example
 * ```ts
 * isValidDistrict('Jaffna'); // true
 * isValidDistrict('Atlantis'); // false
 * ```
 */
export function isValidDistrict(d: unknown): boolean {
  const cleaned = cleanString(d).toLowerCase();
  return cleaned !== '' && DISTRICT_INDEX.has(cleaned);
}

/**
 * Retrieves province details by code or trilingual name.
 *
 * @param p - Province code or name in English, Sinhala, or Tamil.
 * @returns A copy of the province details, or `null` if unknown.
 *
 * @example
 * ```ts
 * getProvinceInfo('Western')?.nameSi; // 'බස්නාහිර'
 * getProvinceInfo('WP')?.districts.length; // 3
 * ```
 */
export function getProvinceInfo(p: unknown): ProvinceInfo | null {
  const cleaned = cleanString(p).toLowerCase();
  if (!cleaned) return null;

  const province = PROVINCE_INDEX.get(cleaned);
  return province ? { ...province, districts: [...province.districts] } : null;
}

/**
 * Retrieves district details by name or Sinhala/Tamil name.
 *
 * @param d - District name in English, Sinhala, or Tamil.
 * @returns A copy of the district details, or `null` if unknown.
 *
 * @example
 * ```ts
 * getDistrictInfo('Kandy')?.provinceName; // 'Central'
 * getDistrictInfo('Kandy')?.nameTa; // 'கண்டி'
 * ```
 */
export function getDistrictInfo(d: unknown): DistrictInfo | null {
  const cleaned = cleanString(d).toLowerCase();
  if (!cleaned) return null;

  const district = DISTRICT_INDEX.get(cleaned);
  return district ? { ...district } : null;
}

/**
 * Returns all 9 Sri Lankan provinces with details.
 *
 * @returns Copies of all 9 provinces.
 *
 * @example
 * ```ts
 * getProvinces().length; // 9
 * ```
 */
export function getProvinces(): ProvinceInfo[] {
  return PROVINCES.map((prov) => ({ ...prov, districts: [...prov.districts] }));
}

/**
 * Returns all 25 Sri Lankan districts with details.
 *
 * @returns Copies of all 25 districts.
 *
 * @example
 * ```ts
 * getDistricts().length; // 25
 * ```
 */
export function getDistricts(): DistrictInfo[] {
  return DISTRICTS.map((dist) => ({ ...dist }));
}
