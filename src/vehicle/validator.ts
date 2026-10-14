import { cleanString, createFailure, createSuccess } from '../common/utils';
import type { ValidationResult } from '../common/types';
import { parseVehiclePlate } from './parser';
import type { VehiclePlateInfo } from './types';

/**
 * Validates whether the input is a valid Sri Lankan vehicle registration number plate.
 */
export function isValidVehiclePlate(plate: unknown): boolean {
  return parseVehiclePlate(plate) !== null;
}

/**
 * Formats a Sri Lankan vehicle number plate into clean standardized format.
 */
export function formatVehiclePlate(plate: unknown): string | null {
  const info = parseVehiclePlate(plate);
  return info ? info.formatted : null;
}

/**
 * Validates a Sri Lankan vehicle number plate returning detailed ValidationResult.
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
