import { describe, expect, it } from 'vitest';
import * as LankaValidations from '../src/index';

describe('Root Package Exports', () => {
  it('exports all major validation functions', () => {
    expect(typeof LankaValidations.isValidNic).toBe('function');
    expect(typeof LankaValidations.validateNic).toBe('function');
    expect(typeof LankaValidations.parseNic).toBe('function');
    expect(typeof LankaValidations.convertOldToNewNic).toBe('function');
    expect(typeof LankaValidations.convertNewToOldNic).toBe('function');

    expect(typeof LankaValidations.isValidPhone).toBe('function');
    expect(typeof LankaValidations.isValidMobile).toBe('function');
    expect(typeof LankaValidations.isValidLandline).toBe('function');
    expect(typeof LankaValidations.isValidShortCode).toBe('function');
    expect(typeof LankaValidations.parsePhone).toBe('function');
    expect(typeof LankaValidations.formatPhone).toBe('function');

    expect(typeof LankaValidations.isValidPassport).toBe('function');
    expect(typeof LankaValidations.parsePassport).toBe('function');

    expect(typeof LankaValidations.isValidDrivingLicense).toBe('function');
    expect(typeof LankaValidations.parseDrivingLicense).toBe('function');

    expect(typeof LankaValidations.isValidVehiclePlate).toBe('function');
    expect(typeof LankaValidations.parseVehiclePlate).toBe('function');
    expect(typeof LankaValidations.formatVehiclePlate).toBe('function');

    expect(typeof LankaValidations.isValidLKR).toBe('function');
    expect(typeof LankaValidations.parseLKR).toBe('function');
    expect(typeof LankaValidations.formatLKR).toBe('function');
    expect(typeof LankaValidations.lkrToWords).toBe('function');

    expect(typeof LankaValidations.isValidDob).toBe('function');
    expect(typeof LankaValidations.matchesNicDob).toBe('function');

    expect(typeof LankaValidations.isValidGender).toBe('function');
    expect(typeof LankaValidations.matchesNicGender).toBe('function');

    expect(typeof LankaValidations.isValidPostalCode).toBe('function');
    expect(typeof LankaValidations.lookupPostalCode).toBe('function');

    expect(typeof LankaValidations.isValidBankCode).toBe('function');
    expect(typeof LankaValidations.isValidBranchCode).toBe('function');
    expect(typeof LankaValidations.getBankByCode).toBe('function');

    expect(typeof LankaValidations.isValidTIN).toBe('function');
    expect(typeof LankaValidations.isValidVAT).toBe('function');

    expect(typeof LankaValidations.isValidProvince).toBe('function');
    expect(typeof LankaValidations.isValidDistrict).toBe('function');

    expect(typeof LankaValidations.createSchemaValidator).toBe('function');
    expect(typeof LankaValidations.rules).toBe('object');
  });
});

