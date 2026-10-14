import { describe, expect, it } from 'vitest';
import { createSchemaValidator, rules } from '../src/schema';

describe('Schema Validator Module', () => {
  it('validates a complete user registration form with cross-field NIC validation', () => {
    const validator = createSchemaValidator({
      nic: rules.nic(),
      phone: rules.phone(),
      dob: [rules.dob({ minAge: 18 }), rules.matchesNicDob('nic')],
      gender: [rules.gender(), rules.matchesNicGender('nic')],
      salary: rules.currency({ min: 1000 }),
      postalCode: rules.postalCode(),
    });

    const validData = {
      nic: '921234567V', // Male, DOB: 1992-05-02
      phone: '0771234567',
      dob: '1992-05-02',
      gender: 'male',
      salary: 'Rs. 150,000.00',
      postalCode: '00100',
    };

    const result = validator.validate(validData);
    expect(result.isValid).toBe(true);
    expect(result.errorList.length).toBe(0);
  });

  it('fails when DOB does not match NIC', () => {
    const validator = createSchemaValidator({
      nic: rules.nic(),
      dob: rules.matchesNicDob('nic'),
    });

    const mismatched = {
      nic: '921234567V', // DOB: 1992-05-02
      dob: '1995-01-01', // mismatch!
    };

    const result = validator.validate(mismatched);
    expect(result.isValid).toBe(false);
    expect(result.errors.dob).toBe('Date of Birth does not match NIC');
  });

  it('fails when gender does not match NIC', () => {
    const validator = createSchemaValidator({
      nic: rules.nic(),
      gender: rules.matchesNicGender('nic'),
    });

    const mismatched = {
      nic: '921234567V', // male
      gender: 'female', // mismatch!
    };

    const result = validator.validate(mismatched);
    expect(result.isValid).toBe(false);
    expect(result.errors.gender).toBe('Gender does not match NIC');
  });

  it('fails when currency is below minimum', () => {
    const validator = createSchemaValidator({
      amount: rules.currency({ min: 500 }),
    });

    const result = validator.validate({ amount: 'Rs. 200' });
    expect(result.isValid).toBe(false);
  });
});
