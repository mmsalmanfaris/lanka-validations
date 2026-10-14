import { describe, expect, it } from 'vitest';
import { createSchemaValidator, rules, SchemaValidator } from '../src/schema';

describe('Schema rules', () => {
  it.each([
    ['passport', rules.passport(), 'N1234567', 'invalid'],
    ['drivingLicense', rules.drivingLicense(), 'B1234567', 'invalid'],
    ['vehiclePlate', rules.vehiclePlate(), 'WP CAB-1234', 'invalid'],
    ['bankCode', rules.bankCode(), '7010', '0000'],
    ['tin', rules.tin(), '123456789', 'invalid'],
    ['vat', rules.vat(), '123456789-7000', 'invalid'],
    ['gender', rules.gender(), 'female', 'unknown'],
    ['mobile', rules.mobile(), '0771234567', '0112345678'],
    ['contactPhone', rules.contactPhone(), '0112345678', '119'],
  ])('%s accepts a valid value and rejects an invalid one', (_name, rule, valid, invalid) => {
    const validator = createSchemaValidator({ field: rule });

    expect(validator.validate({ field: valid }).isValid).toBe(true);
    const failure = validator.validate({ field: invalid });
    expect(failure.isValid).toBe(false);
    expect(failure.errorList).toHaveLength(1);
  });

  it('reports a dedicated code for each phone-type restriction', () => {
    expect(
      createSchemaValidator({ p: rules.mobile() }).validate({ p: '0112345678' }).errorCodes.p,
    ).toBe('PHONE_NOT_MOBILE');
    expect(
      createSchemaValidator({ p: rules.contactPhone() }).validate({ p: '119' }).errorCodes.p,
    ).toBe('PHONE_SHORT_CODE_NOT_ALLOWED');
  });

  it('returns bank metadata as parsed data', () => {
    const result = createSchemaValidator({ bank: rules.bankCode() }).validate({ bank: '7010' });

    expect(result.isValid).toBe(true);
    if (result.isValid) expect(result.data.bank.code).toBe('7010');
  });

  it('required rejects undefined, null and blank strings', () => {
    const validator = createSchemaValidator({ name: rules.required() });

    for (const name of [undefined, null, '   ']) {
      const result = validator.validate({ name });
      expect(result.isValid).toBe(false);
      expect(result.errorCodes.name).toBe('REQUIRED');
    }
    expect(validator.validate({ name: 'Kamal' }).isValid).toBe(true);
    expect(
      createSchemaValidator({ name: rules.required('Name please') }).validate({}).errors.name,
    ).toBe('Name please');
  });

  it('optional skips missing values and validates present ones', () => {
    const validator = createSchemaValidator({ nic: rules.optional(rules.nic()) });

    expect(validator.validate({}).isValid).toBe(true);
    expect(validator.validate({ nic: '' }).isValid).toBe(true);
    expect(validator.validate({ nic: '921234567V' }).isValid).toBe(true);
    expect(validator.validate({ nic: 'bad' }).isValid).toBe(false);
  });

  it('nullable accepts null and validates other values', () => {
    const validator = createSchemaValidator({ nic: rules.nullable(rules.nic()) });

    const nullResult = validator.validate({ nic: null });
    expect(nullResult.isValid).toBe(true);
    if (nullResult.isValid) expect(nullResult.data.nic).toBeNull();
    expect(validator.validate({ nic: 'bad' }).isValid).toBe(false);
  });

  it('cross-field rules pass when the value or the NIC field is missing', () => {
    const validator = createSchemaValidator({
      dob: rules.matchesNicDob(),
      gender: rules.matchesNicGender(),
    });

    expect(validator.validate({ dob: '1992-05-02', gender: 'male' }).isValid).toBe(true);
    expect(validator.validate({ nic: '921234567V' }).isValid).toBe(true);
    expect(
      validator.validate({ nic: '921234567V', dob: '1992-05-02', gender: 'male' }).isValid,
    ).toBe(true);
  });
});

describe('SchemaValidator rule results', () => {
  it('treats false as a failure with a default message', () => {
    const result = createSchemaValidator({ age: () => false }).validate({ age: 3 });

    expect(result.errors.age).toBe('Invalid age');
    expect(result.errorCodes.age).toBe('SCHEMA_INVALID');
  });

  it('treats a string as a failure message', () => {
    const result = createSchemaValidator({ age: () => 'Too young' }).validate({ age: 3 });

    expect(result.errors.age).toBe('Too young');
  });

  it('treats true and null as a pass that keeps the raw value', () => {
    const result = createSchemaValidator({ a: () => true, b: () => null }).validate({ a: 1, b: 2 });

    expect(result.isValid).toBe(true);
    if (result.isValid) expect(result.data).toEqual({ a: 1, b: 2 });
  });

  it('stops at the first failing rule for a field', () => {
    let secondRuleCalls = 0;
    const result = createSchemaValidator({
      nic: [
        rules.required(),
        rules.nic(),
        () => {
          secondRuleCalls += 1;
          return true;
        },
      ],
    }).validate({ nic: 'bad' });

    expect(result.errorList).toHaveLength(1);
    expect(secondRuleCalls).toBe(0);
  });

  it('field() appends rules to a builder-style validator', () => {
    const validator = new SchemaValidator<{ nic: unknown }>()
      .field('nic', rules.required())
      .field('nic', rules.nic());

    expect(validator.validate({ nic: '' }).errorCodes.nic).toBe('REQUIRED');
    expect(validator.validate({ nic: 'bad' }).isValid).toBe(false);
    expect(validator.validate({ nic: '921234567V' }).isValid).toBe(true);
  });

  it('accepts null-prototype objects as form data', () => {
    const data = Object.assign(Object.create(null) as object, { nic: '921234567V' });

    expect(createSchemaValidator({ nic: rules.nic() }).validate(data).isValid).toBe(true);
  });

  it('rejects class instances as form data', () => {
    class Form {
      nic = '921234567V';
    }

    expect(createSchemaValidator({ nic: rules.nic() }).validate(new Form()).errorCodes.$root).toBe(
      'SCHEMA_INVALID_ROOT',
    );
  });
});
