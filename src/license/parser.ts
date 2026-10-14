import { cleanString } from '../common/utils';
import { parseNic } from '../nic/parser';
import type { DrivingLicenseInfo } from './types';

/**
 * Parses a Sri Lankan Driving License number.
 * Supports:
 * - Legacy DMT format: B followed by 7 digits (e.g. B1234567)
 * - Modern Smart Card format: DMT B-number or NIC-based license
 *
 * @param rawLicense - Driving licence number. Strings and finite numbers are accepted; other types return a failure without throwing.
 * @returns The detected format and number, or `null` if invalid.
 *
 * @example
 * ```ts
 * parseDrivingLicense('B1234567')?.format; // 'smart_card_b'
 * ```
 */
export function parseDrivingLicense(rawLicense: unknown): DrivingLicenseInfo | null {
  const cleaned = cleanString(rawLicense).toUpperCase().replace(/[\s-]/g, '');
  if (!cleaned) return null;

  // Check DMT B format: B + 7 digits
  if (/^B\d{7}$/.test(cleaned)) {
    return {
      license: cleaned,
      format: 'smart_card_b',
      number: cleaned.slice(1),
    };
  }

  // Check old DMT numeric only format (7 digits)
  if (/^\d{7}$/.test(cleaned)) {
    return {
      license: `B${cleaned}`,
      format: 'legacy',
      number: cleaned,
    };
  }

  // Check NIC-based driving license (common on new DMT smart cards)
  const nicInfo = parseNic(cleaned);
  if (nicInfo) {
    return {
      license: nicInfo.nic,
      format: 'nic_based',
      number: nicInfo.nic,
      nicFormat: nicInfo.format,
    };
  }

  return null;
}
