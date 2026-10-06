import { cleanString } from '../common/utils';
import { VEHICLE_PROVINCES } from './constants';
import type { VehiclePlateInfo } from './types';

/**
 * Parses any Sri Lankan vehicle registration number plate.
 *
 * Supports:
 * - Modern English Series: 'WP CAB-1234', 'CAB-1234', 'WP BZ-9999'
 * - Modern Numeric Series: 'WP 123-4567', '300-1234'
 * - 'Sri' Series: '14 Sri 1234', '14 ශ්‍රී 1234'
 * - Vintage Series: 'EY 1234', 'Z 1234'
 */
export function parseVehiclePlate(rawPlate: unknown): VehiclePlateInfo | null {
  const cleaned = cleanString(rawPlate).toUpperCase().replace(/\s+/g, ' ');
  if (!cleaned) return null;

  // 1. Sri Series (1956 - 2000): e.g. "14 SRI 1234", "14 ශ්‍රී 1234", "14-SRI-1234"
  const sriMatch = cleaned.match(/^(\d{1,2})[\s\-_]*(?:SRI|ශ්‍රී|ශ්රී)[\s\-_]*(\d{4})$/i);
  if (sriMatch) {
    const sriNum = sriMatch[1];
    const number = sriMatch[2];
    return {
      plate: cleaned,
      era: 'sri_series',
      provinceCode: null,
      provinceName: null,
      series: `${sriNum} Sri`,
      number,
      formatted: `${sriNum} Sri ${number}`,
    };
  }

  // 2. Vintage Series (pre-1956): e.g. "Z 1234", "EY 1234" (with space, no province)
  const vintageSingleMatch = cleaned.match(/^([A-Z])[\s\-]+(\d{1,4})$/);
  if (vintageSingleMatch) {
    return {
      plate: cleaned,
      era: 'vintage',
      provinceCode: null,
      provinceName: null,
      series: vintageSingleMatch[1],
      number: vintageSingleMatch[2],
      formatted: `${vintageSingleMatch[1]} ${vintageSingleMatch[2]}`,
    };
  }

  const vintageTwoLetterMatch = cleaned.match(/^([A-Z]{2})\s+(\d{1,4})$/);
  if (vintageTwoLetterMatch) {
    return {
      plate: cleaned,
      era: 'vintage',
      provinceCode: null,
      provinceName: null,
      series: vintageTwoLetterMatch[1],
      number: vintageTwoLetterMatch[2],
      formatted: `${vintageTwoLetterMatch[1]} ${vintageTwoLetterMatch[2]}`,
    };
  }

  // 3. Modern English Series with optional province: e.g. "WP CAB-1234", "CAB-1234", "WP BZ 9999"
  const modernEnglishMatch = cleaned.match(
    /^(?:(WP|CP|SP|NP|EP|NW|NC|UP|SG)\s+)?([A-Z]{2,3})[\s\-]+(\d{4})$/
  );
  if (modernEnglishMatch) {
    const provinceCode = modernEnglishMatch[1] ?? null;
    const series = modernEnglishMatch[2];
    const number = modernEnglishMatch[3];
    const provinceName = provinceCode ? VEHICLE_PROVINCES[provinceCode] : null;
    const formatted = provinceCode
      ? `${provinceCode} ${series}-${number}`
      : `${series}-${number}`;

    return {
      plate: cleaned,
      era: 'modern',
      provinceCode,
      provinceName,
      series,
      number,
      formatted,
    };
  }

  // 3. Modern Numeric Series: e.g. "WP 123-4567", "300-1234", "65-4321"
  const modernNumericMatch = cleaned.match(
    /^(?:(WP|CP|SP|NP|EP|NW|NC|UP|SG)\s+)?(\d{2,3})[\s\-]+(\d{4})$/
  );
  if (modernNumericMatch) {
    const provinceCode = modernNumericMatch[1] ?? null;
    const series = modernNumericMatch[2];
    const number = modernNumericMatch[3];
    const provinceName = provinceCode ? VEHICLE_PROVINCES[provinceCode] : null;
    const formatted = provinceCode
      ? `${provinceCode} ${series}-${number}`
      : `${series}-${number}`;

    return {
      plate: cleaned,
      era: 'modern_numeric',
      provinceCode,
      provinceName,
      series,
      number,
      formatted,
    };
  }

  // 4. Vintage Series (pre-1956): e.g. "EY 1234", "Z 123"
  const vintageMatch = cleaned.match(/^([A-Z]{1,2})[\s\-]+(\d{1,4})$/);
  if (vintageMatch) {
    const series = vintageMatch[1];
    const number = vintageMatch[2];
    return {
      plate: cleaned,
      era: 'vintage',
      provinceCode: null,
      provinceName: null,
      series,
      number,
      formatted: `${series} ${number}`,
    };
  }

  return null;
}
