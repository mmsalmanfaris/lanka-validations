import { cleanString, createFailure, createSuccess } from '../common/utils';
import type { ValidationResult } from '../common/types';
import { DMT_LICENSE_CATEGORIES } from './constants';
import { parseDrivingLicense } from './parser';
import type { DrivingLicenseInfo, LicenseCategoryInfo } from './types';

/**
 * Validates whether the input is a valid Sri Lankan Driving License number.
 */
export function isValidDrivingLicense(license: unknown): boolean {
  return parseDrivingLicense(license) !== null;
}

/**
 * Validates whether the given code is an official Sri Lankan DMT license category (e.g. 'A', 'B', 'B1', 'C1').
 */
export function isValidLicenseCategory(cat: unknown): boolean {
  const cleaned = cleanString(cat).toUpperCase();
  return Boolean(DMT_LICENSE_CATEGORIES[cleaned]);
}

/**
 * Retrieves details for a specific license category (e.g. 'B1' -> Three-wheeler, minAge 18).
 */
export function getLicenseCategoryInfo(cat: unknown): LicenseCategoryInfo | null {
  const cleaned = cleanString(cat).toUpperCase();
  return DMT_LICENSE_CATEGORIES[cleaned] ?? null;
}

/**
 * Returns all official DMT license categories.
 */
export function getAllLicenseCategories(): LicenseCategoryInfo[] {
  return Object.values(DMT_LICENSE_CATEGORIES);
}

/**
 * Validates a Sri Lankan driving license returning detailed ValidationResult.
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
      'LICENSE_INVALID'
    );
  }

  return createSuccess(info);
}
