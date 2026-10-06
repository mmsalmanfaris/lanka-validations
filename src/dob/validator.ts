import { cleanString, createFailure, createSuccess, formatIsoDate } from '../common/utils';
import type { ValidationResult } from '../common/types';
import { parseNic } from '../nic/parser';
import type { DobOptions } from './types';

/**
 * Parses various date formats into a Date object.
 * Supports: Date object, 'YYYY-MM-DD', 'YYYY/MM/DD', 'DD-MM-YYYY', 'DD/MM/YYYY'.
 */
export function parseDob(input: unknown): Date | null {
  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input;
  }

  const str = cleanString(input);
  if (!str) return null;

  // YYYY-MM-DD or YYYY/MM/DD
  const isoMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (isoMatch) {
    const y = parseInt(isoMatch[1], 10);
    const m = parseInt(isoMatch[2], 10);
    const d = parseInt(isoMatch[3], 10);
    const date = new Date(Date.UTC(y, m - 1, d));
    if (
      date.getUTCFullYear() === y &&
      date.getUTCMonth() === m - 1 &&
      date.getUTCDate() === d
    ) {
      return date;
    }
    return null;
  }

  // DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmyMatch) {
    const d = parseInt(dmyMatch[1], 10);
    const m = parseInt(dmyMatch[2], 10);
    const y = parseInt(dmyMatch[3], 10);
    const date = new Date(Date.UTC(y, m - 1, d));
    if (
      date.getUTCFullYear() === y &&
      date.getUTCMonth() === m - 1 &&
      date.getUTCDate() === d
    ) {
      return date;
    }
    return null;
  }

  const timestamp = Date.parse(str);
  if (!isNaN(timestamp)) {
    return new Date(timestamp);
  }

  return null;
}

/**
 * Calculates current age in full completed years.
 */
export function calculateAge(dobInput: unknown, referenceDate?: Date): number | null {
  const dob = parseDob(dobInput);
  if (!dob) return null;

  const ref = referenceDate ? new Date(referenceDate) : new Date();
  let age = ref.getUTCFullYear() - dob.getUTCFullYear();
  const m = ref.getUTCMonth() - dob.getUTCMonth();

  if (m < 0 || (m === 0 && ref.getUTCDate() < dob.getUTCDate())) {
    age--;
  }

  return Math.max(0, age);
}

/**
 * Validates whether an input is a valid Date of Birth.
 */
export function isValidDob(input: unknown, options?: DobOptions): boolean {
  const dob = parseDob(input);
  if (!dob) return false;

  const ref = options?.referenceDate ?? new Date();
  if (dob.getTime() > ref.getTime()) {
    // DOB cannot be in the future
    return false;
  }

  const age = calculateAge(dob, ref);
  if (age === null) return false;

  if (options?.minAge !== undefined && age < options.minAge) {
    return false;
  }
  if (options?.maxAge !== undefined && age > options.maxAge) {
    return false;
  }

  // Hard limit for realistic human age: 125 years
  if (age > 125) {
    return false;
  }

  return true;
}

/**
 * Cross-validates whether the entered DOB matches the date encoded in the user's Sri Lankan NIC.
 */
export function matchesNicDob(dobInput: unknown, nicInput: unknown): boolean {
  const dob = parseDob(dobInput);
  if (!dob) return false;

  const nicInfo = parseNic(nicInput);
  if (!nicInfo) return false;

  const enteredIso = formatIsoDate(dob);
  const nicIso = formatIsoDate(nicInfo.dob);

  return enteredIso === nicIso;
}

/**
 * Validates DOB returning structured ValidationResult.
 */
export function validateDob(
  input: unknown,
  options?: DobOptions
): ValidationResult<{ dob: Date; age: number; isoDate: string }> {
  const dob = parseDob(input);
  if (!dob) {
    return createFailure('Invalid Date of Birth format.', 'DOB_INVALID');
  }

  const ref = options?.referenceDate ?? new Date();
  if (dob.getTime() > ref.getTime()) {
    return createFailure('Date of Birth cannot be in the future.', 'DOB_FUTURE');
  }

  const age = calculateAge(dob, ref);
  if (age === null) {
    return createFailure('Unable to compute age from Date of Birth.', 'DOB_INVALID');
  }

  if (age > 125) {
    return createFailure('Date of Birth exceeds realistic human lifespan.', 'DOB_TOO_OLD');
  }

  if (options?.minAge !== undefined && age < options.minAge) {
    return createFailure(
      `Age ${age} is below minimum required age of ${options.minAge}.`,
      'DOB_BELOW_MIN_AGE'
    );
  }

  if (options?.maxAge !== undefined && age > options.maxAge) {
    return createFailure(
      `Age ${age} exceeds maximum allowed age of ${options.maxAge}.`,
      'DOB_EXCEEDS_MAX_AGE'
    );
  }

  return createSuccess({
    dob,
    age,
    isoDate: formatIsoDate(dob),
  });
}
