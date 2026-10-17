import { describe, expect, it } from 'vitest';
import { formatLKRMinorUnits, parseLKRMinorUnits, validateLKRDecimal } from '../src/currency';

describe('exact LKR minor-unit API', () => {
  it('parses exact decimals and documented grouping', () => {
    expect(parseLKRMinorUnits('Rs. 1,234.50')).toBe(123450n);
    expect(parseLKRMinorUnits('12,34,567.89')).toBe(123456789n);
    expect(parseLKRMinorUnits('1,250.50 LKR')).toBe(125050n);
    expect(formatLKRMinorUnits(-101n)).toBe('-1.01');
  });

  it('applies explicit excess-decimal policies without floating point', () => {
    expect(parseLKRMinorUnits('1.999')).toBeNull();
    expect(parseLKRMinorUnits('1.999', { excessDecimals: 'truncate' })).toBe(199n);
    expect(parseLKRMinorUnits('1.999', { excessDecimals: 'round' })).toBe(200n);
    expect(parseLKRMinorUnits('-1.005', { allowNegative: true, excessDecimals: 'round' })).toBe(
      -101n,
    );
  });

  it('rejects numbers, bad grouping, symbols in both positions, and excessive ranges', () => {
    expect(validateLKRDecimal(1.1).isValid).toBe(false);
    expect(validateLKRDecimal('1,2,3').isValid).toBe(false);
    expect(validateLKRDecimal('Rs. 1 LKR').isValid).toBe(false);
    expect(validateLKRDecimal('100.00', { maxMinorUnits: 9999n }).isValid).toBe(false);
  });

  it('parses whole amounts and accounting-style negatives', () => {
    const whole = validateLKRDecimal('1250');
    expect(whole.data?.minorUnits).toBe(125000n);
    expect(whole.data?.decimal).toBe('1250.00');

    expect(parseLKRMinorUnits('(1,250.50)', { allowNegative: true })).toBe(-125050n);
  });

  it('returns specific error codes for blank, unbalanced, and negative input', () => {
    expect(validateLKRDecimal('   ').code).toBe('CURRENCY_REQUIRED');
    expect(validateLKRDecimal('(100').code).toBe('CURRENCY_INVALID');
    expect(validateLKRDecimal('-5.00').code).toBe('CURRENCY_NEGATIVE');
  });

  it('rejects a negative maximum', () => {
    const result = validateLKRDecimal('1.00', { maxMinorUnits: -1n });
    expect(result.code).toBe('CURRENCY_INVALID');
    expect(result.error).toBe('Maximum minor units must not be negative.');
  });
});
