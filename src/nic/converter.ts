import { parseNic } from './parser';
import type { NicOptions } from './types';

/**
 * Converts a 10-character Old Sri Lankan NIC (9 digits + V/X) into a 12-digit New NIC.
 * Format: 19YY + DDD + 0 + SSS + C
 * Example: 921234567V -> 199212304567
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
