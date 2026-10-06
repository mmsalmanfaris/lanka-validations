import { parsePhone } from './parser';

export type PhoneFormatStyle = 'e164' | 'national' | 'international' | 'rfc3966';

/**
 * Formats a Sri Lankan phone number into standard formats.
 *
 * Examples:
 * - formatPhone('0771234567', 'e164') -> '+94771234567'
 * - formatPhone('0771234567', 'national') -> '077 123 4567'
 * - formatPhone('0771234567', 'international') -> '+94 77 123 4567'
 * - formatPhone('0771234567', 'rfc3966') -> 'tel:+94-77-123-4567'
 */
export function formatPhone(
  phone: unknown,
  style: PhoneFormatStyle = 'national'
): string | null {
  const info = parsePhone(phone);
  if (!info) return null;

  switch (style) {
    case 'e164':
      return info.e164;
    case 'international':
      return info.international;
    case 'rfc3966':
      if (info.type === 'short_code') return `tel:${info.normalized}`;
      return `tel:+94-${info.prefix.slice(1)}-${info.normalized.slice(3, 6)}-${info.normalized.slice(6)}`;
    case 'national':
    default:
      return info.national;
  }
}
