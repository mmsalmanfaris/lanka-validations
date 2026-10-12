import { describe, expect, it } from 'vitest';
import { formatLKRMinorUnits, parseLKRMinorUnits, validateLKRDecimal } from '../src/currency';

describe('exact LKR minor-unit API', () => {
  it('parses exact decimals and documented grouping', () => {
    expect(parseLKRMinorUnits('Rs. 1,234.50')).toBe(123450n);
    expect(parseLKRMinorUnits('12,34,567.89')).toBe(123456789n);
    expect(formatLKRMinorUnits(-101n)).toBe('-1.01');
  });

  it('applies explicit excess-decimal policies without floating point', () => {
    expect(parseLKRMinorUnits('1.999')).toBeNull();
    expect(parseLKRMinorUnits('1.999', { excessDecimals: 'truncate' })).toBe(199n);
    expect(parseLKRMinorUnits('1.999', { excessDecimals: 'round' })).toBe(200n);
    expect(parseLKRMinorUnits('-1.005', { allowNegative: true, excessDecimals: 'round' })).toBe(-101n);
  });

  it('rejects numbers, bad grouping, symbols in both positions, and excessive ranges', () => {
    expect(validateLKRDecimal(1.1).isValid).toBe(false);
    expect(validateLKRDecimal('1,2,3').isValid).toBe(false);
    expect(validateLKRDecimal('Rs. 1 LKR').isValid).toBe(false);
    expect(validateLKRDecimal('100.00', { maxMinorUnits: 9999n }).isValid).toBe(false);
  });
});
