import { cleanString } from '../common/utils';
import type { PassportInfo, PassportType } from './types';

/**
 * Parses a Sri Lankan passport number.
 * Standard MRP: 1 letter (N, M, L, D, O) + 7 digits (e.g. N1234567)
 * E-Passport: 1-2 letters + 7-8 digits (e.g. P1234567, PA1234567)
 *
 * @param rawPassport - Passport number. Strings and finite numbers are accepted; other types return a failure without throwing.
 * @returns Series prefix, digits, and inferred type, or `null` if the format is invalid.
 *
 * @example
 * ```ts
 * parsePassport('N1234567')?.type; // 'ordinary'
 * parsePassport('D1234567')?.type; // 'diplomatic'
 * ```
 */
export function parsePassport(rawPassport: unknown): PassportInfo | null {
  const cleaned = cleanString(rawPassport).toUpperCase().replace(/[\s-]/g, '');
  if (!cleaned) return null;

  // Standard Sri Lankan MRP: 1 letter + 7 digits
  const mrpMatch = cleaned.match(/^([NMLDO])(\d{7})$/);
  if (mrpMatch) {
    const prefix = mrpMatch[1]!;
    const number = mrpMatch[2]!;
    let type: PassportType = 'ordinary';

    if (prefix === 'D') {
      type = 'diplomatic';
    } else if (prefix === 'O') {
      type = 'official';
    }

    return {
      passport: cleaned,
      type,
      prefix,
      number,
      isEPassport: false,
    };
  }

  // Modern / e-Passport: P or PA or other letters + 7 to 8 digits
  const ePassportMatch = cleaned.match(/^([A-Z]{1,2})(\d{7,8})$/);
  if (ePassportMatch) {
    const prefix = ePassportMatch[1]!;
    const number = ePassportMatch[2]!;
    let type: PassportType;

    if (prefix === 'D') {
      type = 'diplomatic';
    } else if (prefix === 'O') {
      type = 'official';
    } else if (prefix === 'E') {
      type = 'emergency';
    } else if (['N', 'M', 'L', 'P', 'PA'].includes(prefix)) {
      type = 'ordinary';
    } else {
      type = 'unknown';
    }

    return {
      passport: cleaned,
      type,
      prefix,
      number,
      isEPassport: true,
    };
  }

  return null;
}
