import { describe, expect, it } from 'vitest';
import {
  isValidPostalCode,
  lookupPostalCode,
  validatePostalCode,
} from '../src/postal-code';

describe('Postal Code Module', () => {
  it('validates and looks up Colombo post codes (00100)', () => {
    expect(isValidPostalCode('00100')).toBe(true);
    expect(isValidPostalCode(100)).toBe(true);

    const lookup = lookupPostalCode('00100');
    expect(lookup?.district).toBe('Colombo');
    expect(lookup?.province).toBe('Western');
    expect(lookup?.primaryCity).toBe('Colombo 01 (Fort)');
  });

  it('validates Kandy post code (20000)', () => {
    const lookup = lookupPostalCode('20000');
    expect(lookup?.district).toBe('Kandy');
    expect(lookup?.province).toBe('Central');
    expect(lookup?.primaryCity).toBe('Kandy');
  });

  it('validates Galle post code (80000)', () => {
    const lookup = lookupPostalCode('80000');
    expect(lookup?.district).toBe('Galle');
    expect(lookup?.province).toBe('Southern');
  });

  it('validates Jaffna post code (40000)', () => {
    const lookup = lookupPostalCode('40000');
    expect(lookup?.district).toBe('Jaffna');
    expect(lookup?.province).toBe('Northern');
  });

  it('rejects invalid or non-existent postal codes', () => {
    expect(isValidPostalCode('99999')).toBe(false);
    expect(isValidPostalCode('abc')).toBe(false);
    expect(isValidPostalCode('')).toBe(false);
  });

  it('returns structured validation result', () => {
    expect(validatePostalCode('00100').isValid).toBe(true);
    expect(validatePostalCode('99999').isValid).toBe(false);
    expect(validatePostalCode('99999').code).toBe('POSTAL_CODE_OUT_OF_RANGE');
  });
});
