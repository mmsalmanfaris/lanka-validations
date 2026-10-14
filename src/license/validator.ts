import { cleanString, createFailure, createSuccess } from '../common/utils';
import type { ValidationResult } from '../common/types';
import { DMT_LICENSE_CATEGORIES } from './constants';
import { parseDrivingLicense } from './parser';
import type { DrivingLicenseInfo, LicenseCategoryInfo } from './types';

/**
 * Validates whether the input is a valid Sri Lankan Driving License number.
 *
 * @param license - Driving licence number to check.
 * @returns `true` for a legacy, smart-card, or NIC-based licence number.
 *
 * @example
 * ```ts
 * isValidDrivingLicense('B1234567'); // true
 * isValidDrivingLicense('ABC'); // false
 * ```
 */
export function isValidDrivingLicense(license: unknown): boolean {
  return parseDrivingLicense(license) !== null;
}

/**
 * Validates whether the given code is an official Sri Lankan DMT license category (e.g. 'A', 'B', 'B1', 'C1').
 *
 * @param cat - DMT vehicle class code, such as `'B1'`. Case-insensitive.
 * @returns `true` for a known DMT vehicle class.
 *
 * @example
 * ```ts
 * isValidLicenseCategory('b1'); // true
 * isValidLicenseCategory('Z9'); // false
 * ```
 */
export function isValidLicenseCategory(cat: unknown): boolean {
  return Object.hasOwn(DMT_LICENSE_CATEGORIES, cleanString(cat).toUpperCase());
}

/**
 * Retrieves details for a specific license category (e.g. 'B1' -> Three-wheeler, minAge 18).
 *
 * @param cat - DMT vehicle class code, such as `'B1'`.
 * @returns A copy of the class details, or `null` if unknown.
 *
 * @example
 * ```ts
 * getLicenseCategoryInfo('B1')?.minAge; // 18
 * getLicenseCategoryInfo('Z9'); // null
 * ```
 */
export function getLicenseCategoryInfo(cat: unknown): LicenseCategoryInfo | null {
  const cleaned = cleanString(cat).toUpperCase();
  return Object.hasOwn(DMT_LICENSE_CATEGORIES, cleaned)
    ? { ...DMT_LICENSE_CATEGORIES[cleaned]! }
    : null;
}

/**
 * Returns all official DMT license categories.
 *
 * @returns Copies of every DMT vehicle class.
 *
 * @example
 * ```ts
 * getAllLicenseCategories().length > 0; // true
 * ```
 */
export function getAllLicenseCategories(): LicenseCategoryInfo[] {
  return Object.values(DMT_LICENSE_CATEGORIES).map((category) => ({ ...category }));
}

/**
 * Validates a Sri Lankan driving license returning detailed ValidationResult.
 *
 * @param license - Driving licence number to check.
 * @returns `{ isValid: true, data }` with `DrivingLicenseInfo`, or `{ isValid: false, error, errors, code }`.
 *
 * @example
 * ```ts
 * validateDrivingLicense('B1234567').isValid; // true
 * ```
 */
export function validateDrivingLicense(license: unknown): ValidationResult<DrivingLicenseInfo> {
  const cleaned = cleanString(license);
  if (!cleaned) {
    return createFailure('Driving license number is required.', 'LICENSE_REQUIRED');
  }

  const info = parseDrivingLicense(cleaned);
  if (!info) {
    return createFailure(
      'Invalid Sri Lankan driving license number. Expected format: B1234567 or valid NIC number.',
      'LICENSE_INVALID',
    );
  }

  return createSuccess(info);
}
