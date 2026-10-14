/**
 * Sri Lanka's 9 provinces and 25 districts, with names in English, Sinhala, and Tamil.
 *
 * Import from `lanka-validations/administrative`, or from the package root.
 *
 * Look up a province or district by any of its names. Getters return copies you can change safely.
 *
 * @example
 * ```ts
 * import { getDistrictInfo, getProvinceInfo, isValidDistrict } from 'lanka-validations/administrative';
 *
 * isValidDistrict('Jaffna'); // true
 * getDistrictInfo('Kandy')?.provinceName; // 'Central'
 * getProvinceInfo('Western')?.nameSi; // 'බස්නාහිර'
 * ```
 *
 * @module administrative
 */

export * from './types';
export * from './data';
export * from './validator';
