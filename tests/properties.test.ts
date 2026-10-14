import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import * as lib from '../src';

/** Validators and parsers that accept untrusted `unknown` input as their first argument. */
const UNKNOWN_INPUT_FUNCTIONS = {
  isValidNic: lib.isValidNic,
  isValidOldNic: lib.isValidOldNic,
  isValidNewNic: lib.isValidNewNic,
  validateNic: lib.validateNic,
  parseNic: lib.parseNic,
  convertOldToNewNic: lib.convertOldToNewNic,
  convertNewToOldNic: lib.convertNewToOldNic,
  isValidPhone: lib.isValidPhone,
  isValidContactPhone: lib.isValidContactPhone,
  isValidMobile: lib.isValidMobile,
  isValidLandline: lib.isValidLandline,
  isValidShortCode: lib.isValidShortCode,
  validatePhone: lib.validatePhone,
  parsePhone: lib.parsePhone,
  normalizePhoneNumber: lib.normalizePhoneNumber,
  formatPhone: lib.formatPhone,
  isValidPassport: lib.isValidPassport,
  validatePassport: lib.validatePassport,
  parsePassport: lib.parsePassport,
  isValidDrivingLicense: lib.isValidDrivingLicense,
  validateDrivingLicense: lib.validateDrivingLicense,
  parseDrivingLicense: lib.parseDrivingLicense,
  isValidLicenseCategory: lib.isValidLicenseCategory,
  isValidVehiclePlate: lib.isValidVehiclePlate,
  validateVehiclePlate: lib.validateVehiclePlate,
  parseVehiclePlate: lib.parseVehiclePlate,
  formatVehiclePlate: lib.formatVehiclePlate,
  isValidLKR: lib.isValidLKR,
  validateLKR: lib.validateLKR,
  parseLKR: lib.parseLKR,
  validateLKRDecimal: lib.validateLKRDecimal,
  parseLKRMinorUnits: lib.parseLKRMinorUnits,
  isValidDob: lib.isValidDob,
  validateDob: lib.validateDob,
  parseDob: lib.parseDob,
  calculateAge: lib.calculateAge,
  isValidGender: lib.isValidGender,
  validateGender: lib.validateGender,
  normalizeGender: lib.normalizeGender,
  isValidPostalCode: lib.isValidPostalCode,
  validatePostalCode: lib.validatePostalCode,
  normalizePostalCode: lib.normalizePostalCode,
  lookupPostalCode: lib.lookupPostalCode,
  isValidBankCode: lib.isValidBankCode,
  validateBankCode: lib.validateBankCode,
  getBankByCode: lib.getBankByCode,
  isValidBranchCode: lib.isValidBranchCode,
  isValidBankAccountNumber: lib.isValidBankAccountNumber,
  validateBankAccount: lib.validateBankAccount,
  isValidTIN: lib.isValidTIN,
  validateTIN: lib.validateTIN,
  isValidVAT: lib.isValidVAT,
  validateVAT: lib.validateVAT,
  isValidProvince: lib.isValidProvince,
  getProvinceInfo: lib.getProvinceInfo,
  isValidDistrict: lib.isValidDistrict,
  getDistrictInfo: lib.getDistrictInfo,
  maskNic: lib.maskNic,
  maskPhone: lib.maskPhone,
  maskBankAccount: lib.maskBankAccount,
} as const satisfies Record<string, (input: unknown) => unknown>;

/** Boolean predicates paired with the detailed validator that must agree with them. */
const PREDICATE_PAIRS = [
  ['isValidNic', lib.isValidNic, lib.validateNic],
  ['isValidPhone', lib.isValidPhone, lib.validatePhone],
  ['isValidPassport', lib.isValidPassport, lib.validatePassport],
  ['isValidDrivingLicense', lib.isValidDrivingLicense, lib.validateDrivingLicense],
  ['isValidVehiclePlate', lib.isValidVehiclePlate, lib.validateVehiclePlate],
  ['isValidLKR', lib.isValidLKR, lib.validateLKR],
  ['isValidDob', lib.isValidDob, lib.validateDob],
  ['isValidGender', lib.isValidGender, lib.validateGender],
  ['isValidPostalCode', lib.isValidPostalCode, lib.validatePostalCode],
  ['isValidBankCode', lib.isValidBankCode, lib.validateBankCode],
  ['isValidTIN', lib.isValidTIN, lib.validateTIN],
  ['isValidVAT', lib.isValidVAT, lib.validateVAT],
] as const;

/** Strings shaped like real identifiers, to reach deeper parser branches than random text. */
const identifierLike = fc.oneof(
  fc.string(),
  fc.stringMatching(/^[0-9VXvx +\-./()_]{0,16}$/),
  fc.stringMatching(/^[A-Z]{0,3}[ -]?[0-9]{0,12}[A-Z]?$/),
  fc.stringMatching(/^(Rs\.?|LKR|රු\.)? ?-?[0-9,]{0,15}(\.[0-9]{0,4})?$/),
);
const anyInput = fc.oneof(fc.anything(), identifierLike, fc.double(), fc.integer());

describe('property: untrusted input never throws', () => {
  it.each(Object.entries(UNKNOWN_INPUT_FUNCTIONS))('%s', (_name, fn) => {
    fc.assert(
      fc.property(anyInput, (input) => {
        fn(input);
      }),
    );
  });

  it('schema validation never throws for arbitrary form data', () => {
    const validator = lib.createSchemaValidator({
      nic: lib.rules.optional(lib.rules.nic()),
      phone: lib.rules.optional(lib.rules.phone()),
      dob: [lib.rules.optional(lib.rules.dob()), lib.rules.matchesNicDob()],
      gender: [lib.rules.optional(lib.rules.gender()), lib.rules.matchesNicGender()],
    });
    fc.assert(
      fc.property(anyInput, (data) => {
        validator.validate(data);
      }),
    );
  });
});

describe('property: predicates agree with detailed validators', () => {
  it.each(PREDICATE_PAIRS)('%s', (_name, isValid, validate) => {
    fc.assert(
      fc.property(anyInput, (input) => {
        expect(isValid(input)).toBe(validate(input).isValid);
      }),
    );
  });

  it('failures always carry a code and a message', () => {
    fc.assert(
      fc.property(anyInput, (input) => {
        for (const [, , validate] of PREDICATE_PAIRS) {
          const result = validate(input);
          if (!result.isValid) {
            expect(result.code).toMatch(/^[A-Z][A-Z0-9_]+$/);
            expect(result.error.length).toBeGreaterThan(0);
          }
        }
      }),
    );
  });
});

describe('property: input bounds', () => {
  it('rejects any string longer than MAX_INPUT_LENGTH, even if it wraps a valid value', () => {
    const valid = ['921234567V', '0771234567', 'N1234567', 'B1234567', '00100', '7010'];
    fc.assert(
      fc.property(fc.constantFrom(...valid), fc.nat(64), (value, extra) => {
        const padded = ' '.repeat(lib.MAX_INPUT_LENGTH - value.length + 1 + extra) + value;
        for (const [, isValid] of PREDICATE_PAIRS) expect(isValid(padded)).toBe(false);
      }),
    );
  });
});

describe('property: NIC conversion', () => {
  const oldNic = fc
    .tuple(
      fc.integer({ min: 0, max: 99 }),
      fc.integer({ min: 1, max: 866 }),
      fc.integer({ min: 0, max: 9999 }),
      fc.constantFrom('V', 'X'),
    )
    .map(
      ([year, day, serial, letter]) =>
        `${String(year).padStart(2, '0')}${String(day).padStart(3, '0')}${String(serial).padStart(4, '0')}${letter}`,
    )
    .filter((nic) => lib.isValidOldNic(nic));

  it('old to new conversion keeps date of birth and gender, and round-trips', () => {
    fc.assert(
      fc.property(oldNic, (nic) => {
        const converted = lib.convertOldToNewNic(nic);
        expect(converted).not.toBeNull();
        const before = lib.parseNic(nic)!;
        const after = lib.parseNic(converted)!;
        expect(after.format).toBe('new');
        expect(lib.formatIsoDate(after.dob)).toBe(lib.formatIsoDate(before.dob));
        expect(after.gender).toBe(before.gender);
        expect(lib.convertNewToOldNic(converted, { isVoter: nic.endsWith('V') })).toBe(nic);
      }),
    );
  });
});

describe('property: currency', () => {
  const minorUnits = fc.bigInt({ min: -lib.MAX_LKR_MINOR_UNITS, max: lib.MAX_LKR_MINOR_UNITS });

  it('exact minor units round-trip through their decimal string', () => {
    fc.assert(
      fc.property(minorUnits, (value) => {
        expect(
          lib.parseLKRMinorUnits(lib.formatLKRMinorUnits(value), { allowNegative: true }),
        ).toBe(value);
      }),
    );
  });

  it('formatted amounts parse back to the same value', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 99_999_999_999 }), fc.boolean(), (cents, lakh) => {
        const amount = cents / 100;
        expect(lib.parseLKR(lib.formatLKR(amount, { lakhScale: lakh }))).toBeCloseTo(amount, 2);
      }),
    );
  });

  it('words never describe 100 or more cents', () => {
    fc.assert(
      fc.property(fc.double({ min: 0, max: 999_999_999, noNaN: true }), (amount) => {
        expect(lib.lkrToWords(amount)).not.toMatch(/Hundred Cents/);
      }),
    );
  });
});

describe('property: phone formatting', () => {
  const mobile = fc
    .tuple(fc.constantFrom('70', '71', '72', '74', '75', '76', '77', '78'), fc.nat(9_999_999))
    .map(([prefix, rest]) => `0${prefix}${String(rest).padStart(7, '0')}`);

  it.each(['national', 'international', 'e164'] as const)(
    '%s format normalizes back to the same number',
    (style) => {
      fc.assert(
        fc.property(mobile, (phone) => {
          const formatted = lib.formatPhone(phone, style);
          expect(formatted).not.toBeNull();
          expect(lib.normalizePhoneNumber(formatted)).toBe(lib.normalizePhoneNumber(phone));
        }),
      );
    },
  );
});
