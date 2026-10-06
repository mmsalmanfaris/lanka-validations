import { cleanString } from '../common/utils';
import { DISTRICTS, PROVINCES } from './data';
import type { DistrictInfo, ProvinceInfo } from './types';

/**
 * Validates whether the given string is a valid Sri Lankan province name, Sinhala/Tamil name, or province code (e.g. 'WP', 'Western', 'බස්නාහිර').
 */
export function isValidProvince(p: unknown): boolean {
  return getProvinceInfo(p) !== null;
}

/**
 * Validates whether the given string is a valid Sri Lankan district name, Sinhala name, or Tamil name (e.g. 'Colombo', 'කොළඹ', 'கொழும்பு').
 */
export function isValidDistrict(d: unknown): boolean {
  return getDistrictInfo(d) !== null;
}

/**
 * Retrieves province details by code or trilingual name.
 */
export function getProvinceInfo(p: unknown): ProvinceInfo | null {
  const cleaned = cleanString(p).toLowerCase();
  if (!cleaned) return null;

  for (const prov of PROVINCES) {
    if (
      prov.code.toLowerCase() === cleaned ||
      prov.name.toLowerCase() === cleaned ||
      prov.nameSi.toLowerCase() === cleaned ||
      prov.nameTa.toLowerCase() === cleaned
    ) {
      return prov;
    }
  }

  return null;
}

/**
 * Retrieves district details by name or Sinhala/Tamil name.
 */
export function getDistrictInfo(d: unknown): DistrictInfo | null {
  const cleaned = cleanString(d).toLowerCase();
  if (!cleaned) return null;

  for (const dist of DISTRICTS) {
    if (
      dist.name.toLowerCase() === cleaned ||
      dist.nameSi.toLowerCase() === cleaned ||
      dist.nameTa.toLowerCase() === cleaned
    ) {
      return dist;
    }
  }

  return null;
}

/**
 * Returns all 9 Sri Lankan provinces with details.
 */
export function getProvinces(): ProvinceInfo[] {
  return PROVINCES;
}

/**
 * Returns all 25 Sri Lankan districts with details.
 */
export function getDistricts(): DistrictInfo[] {
  return DISTRICTS;
}

