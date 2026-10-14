import { parseNic } from './parser';
import type { NicOptions } from './types';

/**
 * Converts a 10-character Old Sri Lankan NIC (9 digits + V/X) into a 12-digit New NIC.
 * Format: 19YY + DDD + 0 + SSS + C
 * Example: 921234567V -> 199212304567
 *
 * @param oldNic - Old-format NIC (9 digits + V/X).
 * @param options - Optional `{ referenceDate }` used for age and future-date checks. Defaults to today.
 * @returns The equivalent 12-digit NIC, or `null` if the input is not a valid old-format NIC.
 *
 * @example
 * ```ts
 * convertOldToNewNic('921234567V'); // '199212304567'
 * ```
 */
export function convertOldToNewNic(oldNic: unknown, options?: NicOptions): string | null {
  const info = parseNic(oldNic, options);
  if (!info || info.format !== 'old') {
    return null;
  }
  return info.newNic;
}

/**
 * Converts a 12-digit New Sri Lankan NIC into a 10-character Old NIC if the birth year is between 1900 and 1999.
 * Note: If the 4-digit serial does not start with '0', conversion is strictly lossy/incompatible.
 * Format: YY + DDD + SSS + C + (V or X)
 *
 * @param newNic - New-format 12-digit NIC.
 * @param options - Optional `{ referenceDate, isVoter }`. `isVoter: false` produces the X suffix; the default is V.
 * @returns The equivalent old-format NIC, or `null` if the input is invalid or the holder was not born between 1900 and 1999.
 *
 * @example
 * ```ts
 * convertNewToOldNic('199212304567'); // '921234567V'
 * convertNewToOldNic('199212304567', { isVoter: false }); // '921234567X'
 * convertNewToOldNic('200012304567'); // null
 * ```
 */
export function convertNewToOldNic(
  newNic: unknown,
  options?: NicOptions & { isVoter?: boolean },
): string | null {
  const info = parseNic(newNic, options);
  if (!info || info.format !== 'new' || !info.oldNic) {
    return null;
  }

  const suffix = options?.isVoter === false ? 'X' : 'V';
  // Replace the default 'V' with chosen suffix
  return info.oldNic.slice(0, 9) + suffix;
}
