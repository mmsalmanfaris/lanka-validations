import { describe, expect, it } from 'vitest';
import {
  formatVehiclePlate,
  isValidVehiclePlate,
  parseVehiclePlate,
  validateVehiclePlate,
} from '../src/vehicle';

describe('Vehicle Number Plate Module', () => {
  it('validates modern English province series (WP CAB-1234, CP CAA-5678)', () => {
    expect(isValidVehiclePlate('WP CAB-1234')).toBe(true);
    expect(isValidVehiclePlate('WP CAB 1234')).toBe(true);
    expect(isValidVehiclePlate('CP CAA-5678')).toBe(true);
    expect(isValidVehiclePlate('SP BZ-9999')).toBe(true);

    const parsed = parseVehiclePlate('WP CAB-1234');
    expect(parsed?.era).toBe('modern');
    expect(parsed?.provinceCode).toBe('WP');
    expect(parsed?.provinceName).toBe('Western Province');
    expect(parsed?.series).toBe('CAB');
    expect(parsed?.number).toBe('1234');
    expect(parsed?.formatted).toBe('WP CAB-1234');
  });

  it('validates modern plate without province prefix (CAB-1234)', () => {
    expect(isValidVehiclePlate('CAB-1234')).toBe(true);
    const parsed = parseVehiclePlate('CAB-1234');
    expect(parsed?.series).toBe('CAB');
    expect(parsed?.provinceCode).toBeNull();
  });

  it('validates modern numeric series (WP 123-4567, 300-1234)', () => {
    expect(isValidVehiclePlate('WP 123-4567')).toBe(true);
    expect(isValidVehiclePlate('300-1234')).toBe(true);

    const parsed = parseVehiclePlate('WP 123-4567');
    expect(parsed?.era).toBe('modern_numeric');
  });

  it('validates Sri series (14 Sri 1234, 14 ශ්‍රී 1234)', () => {
    expect(isValidVehiclePlate('14 Sri 1234')).toBe(true);
    expect(isValidVehiclePlate('14 ශ්‍රී 1234')).toBe(true);
    expect(isValidVehiclePlate('31 Sri 5678')).toBe(true);

    const parsed = parseVehiclePlate('14 Sri 1234');
    expect(parsed?.era).toBe('sri_series');
    expect(parsed?.series).toBe('14 Sri');
    expect(parsed?.number).toBe('1234');
  });

  it('validates vintage series (EY 1234)', () => {
    expect(isValidVehiclePlate('EY 1234')).toBe(true);
    const parsed = parseVehiclePlate('EY 1234');
    expect(parsed?.era).toBe('vintage');
    expect(parsed?.series).toBe('EY');
    expect(parsed?.number).toBe('1234');
  });

  it('validates single-letter and hyphenated vintage series (Z 1234, EY-123)', () => {
    const singleLetter = parseVehiclePlate('Z 1234');
    expect(singleLetter?.era).toBe('vintage');
    expect(singleLetter?.series).toBe('Z');
    expect(singleLetter?.provinceCode).toBeNull();
    expect(singleLetter?.formatted).toBe('Z 1234');

    const hyphenated = parseVehiclePlate('EY-123');
    expect(hyphenated?.era).toBe('vintage');
    expect(hyphenated?.series).toBe('EY');
    expect(hyphenated?.number).toBe('123');
    expect(hyphenated?.formatted).toBe('EY 123');
  });

  it('returns null for empty or non-string input', () => {
    expect(parseVehiclePlate('')).toBeNull();
    expect(parseVehiclePlate(null)).toBeNull();
    expect(parseVehiclePlate({})).toBeNull();
    expect(isValidVehiclePlate('   ')).toBe(false);
  });

  it('formats vehicle number plates cleanly', () => {
    expect(formatVehiclePlate('wp cab 1234')).toBe('WP CAB-1234');
    expect(formatVehiclePlate('14 sri 1234')).toBe('14 Sri 1234');
    expect(formatVehiclePlate('z-12')).toBe('Z 12');
    expect(formatVehiclePlate('invalid')).toBeNull();
    expect(formatVehiclePlate(42)).toBeNull();
  });

  it('returns structured validation result', () => {
    expect(validateVehiclePlate('WP CAB-1234').isValid).toBe(true);
    expect(validateVehiclePlate('').isValid).toBe(false);
    expect(validateVehiclePlate('invalid').isValid).toBe(false);
  });
});
