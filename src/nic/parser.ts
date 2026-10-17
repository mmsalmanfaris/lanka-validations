import { cleanString, isLeapYear, padZero } from '../common/utils';
import type { Gender, NicFormat, NicInfo, NicOptions } from './types';

const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * Parses raw days of year (001 - 866) into month (1-12) and day of month (1-31).
 * Uses the library's legacy 366-day table. The non-leap day-60 mapping
 * remains a compatibility rule pending authoritative DRP confirmation.
 *
 * @param year - Four-digit birth year.
 * @param dayOfYear - Day of year from the NIC (1 to 366), after removing the 500 offset for women.
 * @returns `{ month, day }`, or `null` if the day is out of range.
 *
 * @example
 * ```ts
 * parseNicDayOfYear(1992, 123); // { month: 5, day: 2 }
 * ```
 */
export function parseNicDayOfYear(
  year: number,
  dayOfYear: number,
): { month: number; day: number } | null {
  if (!Number.isInteger(year) || !Number.isInteger(dayOfYear) || dayOfYear < 1 || dayOfYear > 366) {
    return null;
  }

  let remaining = dayOfYear;
  let month = 0;

  for (let i = 0; i < DAYS_IN_MONTH.length; i++) {
    const daysInThisMonth = DAYS_IN_MONTH[i]!;
    if (remaining <= daysInThisMonth) {
      month = i + 1;
      break;
    }
    remaining -= daysInThisMonth;
  }

  let day = remaining;

  // Handle Feb 29 for non-leap years
  if (month === 2 && day === 29 && !isLeapYear(year)) {
    day = 28;
  }

  return { month, day };
}

/**
 * Parses a Sri Lankan National Identity Card number.
 * Returns structured NicInfo if valid, or null if invalid.
 *
 * @param rawNic - NIC number, old or new format. Strings and finite numbers are accepted; other types return a failure without throwing.
 * @param options - Optional `{ referenceDate }` used for age and future-date checks. Defaults to today.
 * @returns Decoded details (date of birth, age, gender, both formats), or `null` if the NIC is invalid.
 *
 * @example
 * ```ts
 * parseNic('921234567V')?.dobString; // '1992-05-02'
 * parseNic('921234567V')?.gender; // 'male'
 * parseNic('921234567V')?.newNic; // '199212304567'
 * parseNic('invalid'); // null
 * ```
 */
export function parseNic(rawNic: unknown, options?: NicOptions): NicInfo | null {
  const cleaned = cleanString(rawNic).toUpperCase();
  if (!cleaned) return null;

  const today = options?.referenceDate ?? new Date();
  if (!(today instanceof Date) || !Number.isFinite(today.getTime())) return null;
  const currentYear = today.getUTCFullYear();
  let format: NicFormat;
  let year: number;
  let rawDays: number;
  let serial: string;
  let checkDigit: number;
  let isVoter: boolean | null = null;
  let newNic: string;
  let oldNic: string | null = null;

  if (/^\d{9}[VX]$/.test(cleaned)) {
    format = 'old';
    const yearShort = parseInt(cleaned.substring(0, 2), 10);
    year = 1900 + yearShort;
    rawDays = parseInt(cleaned.substring(2, 5), 10);
    serial = cleaned.substring(5, 8);
    checkDigit = parseInt(cleaned.substring(8, 9), 10);
    isVoter = cleaned.charAt(9) === 'V';

    // Convert to new NIC: 19YY + DDD + 0 + SSS + C
    newNic = `19${cleaned.substring(0, 2)}${cleaned.substring(2, 5)}0${serial}${checkDigit}`;
    oldNic = cleaned;
  } else if (/^\d{12}$/.test(cleaned)) {
    format = 'new';
    year = parseInt(cleaned.substring(0, 4), 10);
    rawDays = parseInt(cleaned.substring(4, 7), 10);
    serial = cleaned.substring(7, 11);
    checkDigit = parseInt(cleaned.substring(11, 12), 10);
    newNic = cleaned;

    // Convert to old NIC if born between 1900 and 1999 and 4th serial digit starts with '0'
    if (year >= 1900 && year <= 1999 && serial.startsWith('0')) {
      const shortYear = year.toString().slice(2);
      const daysStr = cleaned.substring(4, 7);
      const oldSerial = serial.slice(1);
      oldNic = `${shortYear}${daysStr}${oldSerial}${checkDigit}V`;
    }
  } else {
    return null;
  }

  // Validate year range
  if (year < 1850 || year > currentYear) {
    return null;
  }

  // Determine gender and actual day of year
  let gender: Gender;
  let dayOfYear: number;

  if (rawDays > 500) {
    gender = 'female';
    dayOfYear = rawDays - 500;
  } else {
    gender = 'male';
    dayOfYear = rawDays;
  }

  const dateParts = parseNicDayOfYear(year, dayOfYear);
  if (!dateParts) return null;

  const dob = new Date(Date.UTC(year, dateParts.month - 1, dateParts.day));
  const dobString = `${year}-${padZero(dateParts.month, 2)}-${padZero(dateParts.day, 2)}`;

  // Calculate age
  if (dob.getTime() > today.getTime()) return null;
  let age = today.getUTCFullYear() - year;
  const birthMonth = dateParts.month - 1;
  const currentMonth = today.getUTCMonth();
  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && today.getUTCDate() < dateParts.day)
  ) {
    age--;
  }

  return {
    nic: cleaned,
    format,
    year,
    dayOfYear,
    gender,
    dob,
    dobString,
    age: Math.max(0, age),
    serial,
    checkDigit,
    isVoter,
    newNic,
    oldNic,
  };
}
