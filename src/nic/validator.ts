import { cleanString, createFailure, createSuccess } from '../common/utils';
import type { ValidationResult } from '../common/types';
import { parseNic } from './parser';
import type { NicInfo } from './types';

/**
 * Checks whether an input string is a valid Sri Lankan NIC (old or new format).
 */
export function isValidNic(nic: unknown): boolean {
  return parseNic(nic) !== null;
}

/**
 * Checks specifically whether an input is a valid 10-character Old NIC (9 digits + V/X).
 */
export function isValidOldNic(nic: unknown): boolean {
  const info = parseNic(nic);
  return info !== null && info.format === 'old';
}

/**
 * Checks specifically whether an input is a valid 12-digit New NIC.
 */
export function isValidNewNic(nic: unknown): boolean {
  const info = parseNic(nic);
  return info !== null && info.format === 'new';
}

/**
 * Comprehensive NIC validation returning structured ValidationResult with error messages and codes.
 */
export function validateNic(rawNic: unknown): ValidationResult<NicInfo> {
  const cleaned = cleanString(rawNic).toUpperCase();

  if (!cleaned) {
    return createFailure('NIC number is required', 'NIC_REQUIRED');
  }

  const isOldPattern = /^\d{9}[VX]$/.test(cleaned);
  const isNewPattern = /^\d{12}$/.test(cleaned);

  if (!isOldPattern && !isNewPattern) {
    return createFailure(
      'Invalid NIC format. Must be 9 digits followed by V/X or 12 digits.',
      'NIC_INVALID_FORMAT'
    );
  }

  const info = parseNic(cleaned);
  if (!info) {
    const rawDays = isOldPattern
      ? parseInt(cleaned.substring(2, 5), 10)
      : parseInt(cleaned.substring(4, 7), 10);

    const year = isOldPattern
      ? 1900 + parseInt(cleaned.substring(0, 2), 10)
      : parseInt(cleaned.substring(0, 4), 10);

    const currentYear = new Date().getFullYear();
    if (year > currentYear || year < 1850) {
      return createFailure(
        `Invalid birth year in NIC: ${year}. Must be between 1850 and ${currentYear}.`,
        'NIC_INVALID_YEAR'
      );
    }

    const dayOfYear = rawDays > 500 ? rawDays - 500 : rawDays;
    if (dayOfYear < 1 || dayOfYear > 366) {
      return createFailure(
        `Invalid day of year in NIC: ${rawDays}. Must be 001-366 (male) or 501-866 (female).`,
        'NIC_INVALID_DAY'
      );
    }

    return createFailure('Invalid NIC number.', 'NIC_INVALID');
  }

  return createSuccess(info);
}
