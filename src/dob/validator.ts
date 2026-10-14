import { cleanString, createFailure, createSuccess, formatIsoDate } from '../common/utils';
import type { ValidationResult } from '../common/types';
import { parseNic } from '../nic/parser';
import type { DobOptions } from './types';

function validOptions(options?: DobOptions): boolean {
  if (
    options?.referenceDate !== undefined &&
    (!(options.referenceDate instanceof Date) || !Number.isFinite(options.referenceDate.getTime()))
  ) {
    return false;
  }
  const { minAge, maxAge } = options ?? {};
  for (const age of [minAge, maxAge]) {
    if (age !== undefined && (!Number.isInteger(age) || age < 0)) return false;
  }
  return minAge === undefined || maxAge === undefined || minAge <= maxAge;
}

/**
 * Parses various date formats into a Date object.
 * Supports: Date object, 'YYYY-MM-DD', 'YYYY/MM/DD', 'DD-MM-YYYY', 'DD/MM/YYYY'.
 */
export function parseDob(input: unknown): Date | null {
  if (input instanceof Date) {
    if (!Number.isFinite(input.getTime())) return null;
    const date = new Date(input.getTime());
    date.setUTCHours(0, 0, 0, 0);
    return date;
  }
  if (typeof input !== 'string') return null;
  const str = cleanString(input);
  // Require two-digit month/day and matching separators. No Date.parse fallback.
  const iso = /^(\d{4})([-/])(\d{2})\2(\d{2})$/.exec(str);
  const dmy = /^(\d{2})([-/])(\d{2})\2(\d{4})$/.exec(str);
  if (!iso && !dmy) return null;
  const parts = (iso ?? dmy)!;
  const year = Number(iso ? parts[1] : parts[4]);
  const month = Number(parts[3]);
  const day = Number(iso ? parts[4] : parts[1]);
  // setUTCFullYear avoids Date.UTC's special treatment of years 0–99.
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  return year >= 1 &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? date
    : null;
}

/**
 * Calculates current age in full completed years.
 */
export function calculateAge(dobInput: unknown, referenceDate?: Date): number | null {
  if (!validOptions({ referenceDate })) return null;
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
  if (!validOptions(options)) return false;
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
  options?: DobOptions,
): ValidationResult<{ dob: Date; age: number; isoDate: string }> {
  if (!validOptions(options)) {
    return createFailure('Invalid date of birth validation options.', 'DOB_INVALID_OPTIONS');
  }
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
      'DOB_BELOW_MIN_AGE',
    );
  }

  if (options?.maxAge !== undefined && age > options.maxAge) {
    return createFailure(
      `Age ${age} exceeds maximum allowed age of ${options.maxAge}.`,
      'DOB_EXCEEDS_MAX_AGE',
    );
  }

  return createSuccess({
    dob,
    age,
    isoDate: formatIsoDate(dob),
  });
}
