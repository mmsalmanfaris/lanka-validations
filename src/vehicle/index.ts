/**
 * Validate, parse, and format Sri Lankan vehicle registration plates.
 *
 * Import from `lanka-validations/vehicle`, or from the package root.
 *
 * Handles modern letter and numeric series with optional province prefixes, the Sri series, and vintage plates.
 *
 * @example
 * ```ts
 * import { isValidVehiclePlate, parseVehiclePlate } from 'lanka-validations/vehicle';
 *
 * isValidVehiclePlate('WP CAB-1234'); // true
 * parseVehiclePlate('WP CAB-1234')?.provinceName; // 'Western Province'
 * ```
 *
 * @module vehicle
 */

export * from './types';
export * from './constants';
export * from './parser';
export * from './validator';
