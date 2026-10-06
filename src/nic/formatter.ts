import { parseNic } from './parser';
import type { NicFormat } from './types';

export type NicFormatStyle = NicFormat | 'spaced-old' | 'spaced-new';

/**
 * Formats a Sri Lankan NIC cleanly.
 *
 * Examples:
 * - formatNic('921234567v') -> '921234567V'
 * - formatNic('921234567v', 'spaced-old') -> '92123 4567 V'
 * - formatNic('199212304567', 'spaced-new') -> '1992 1230 4567'
 */
export function formatNic(nic: unknown, style?: NicFormatStyle): string | null {
  const info = parseNic(nic);
  if (!info) return null;

  if (style === 'old') {
    return info.oldNic;
  }

  if (style === 'new') {
    return info.newNic;
  }

  if (style === 'spaced-old' && info.oldNic) {
    // 92123 456 7 V
    return `${info.oldNic.slice(0, 5)} ${info.oldNic.slice(5, 8)} ${info.oldNic.slice(8)}`;
  }

  if (style === 'spaced-new') {
    // 1992 123 0456 7
    return `${info.newNic.slice(0, 4)} ${info.newNic.slice(4, 7)} ${info.newNic.slice(7, 11)} ${info.newNic.slice(11)}`;
  }

  return info.nic;
}

