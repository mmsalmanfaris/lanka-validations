import { cleanString, createFailure, createSuccess } from '../common/utils';
import type { ValidationResult } from '../common/types';
import { parseVehiclePlate } from './parser';
import type { VehiclePlateInfo } from './types';

/**
 * Validates whether the input is a valid Sri Lankan vehicle registration number plate.
 *
 * @param plate - Vehicle plate to check.
 * @returns `true` for a modern, Sri-series, or vintage plate format.
 *
 * @example
 * ```ts
 * isValidVehiclePlate('WP CAB-1234'); // true
 * isValidVehiclePlate('CAB1234X'); // false
 * ```
 */
export function isValidVehiclePlate(plate: unknown): boolean {
  return parseVehiclePlate(plate) !== null;
}

/**
 * Formats a Sri Lankan vehicle number plate into clean standardized format.
 *
 * @param plate - Vehicle plate in any common spacing.
 * @returns The plate in standard form, or `null` if invalid.
 *
 * @example
 * ```ts
 * formatVehiclePlate('wp cab 1234'); // 'WP CAB-1234'
 * ```
 */
export function formatVehiclePlate(plate: unknown): string | null {
  const info = parseVehiclePlate(plate);
  return info ? info.formatted : null;
}

/**
 * Validates a Sri Lankan vehicle number plate returning detailed ValidationResult.
 *
 * @param plate - Vehicle plate to check.
 * @returns `{ isValid: true, data }` with `VehiclePlateInfo`, or `{ isValid: false, error, errors, code }`.
 *
 * @example
 * ```ts
 * validateVehiclePlate('WP CAB-1234').isValid; // true
 * ```
 */
export function validateVehiclePlate(plate: unknown): ValidationResult<VehiclePlateInfo> {
  const cleaned = cleanString(plate);
  if (!cleaned) {
    return createFailure('Vehicle plate number is required.', 'PLATE_REQUIRED');
  }

  const info = parseVehiclePlate(cleaned);
  if (!info) {
    return createFailure(
      'Invalid Sri Lankan vehicle number plate. Expected format e.g. "WP CAB-1234", "CAB-1234", or "14 Sri 1234".',
      'PLATE_INVALID',
    );
  }

  return createSuccess(info);
}
