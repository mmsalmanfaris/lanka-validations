import { describe, expect, it } from 'vitest';
import { formatLKR, isValidLKR, lkrToWords, parseLKR, validateLKR } from '../src/currency';

describe('Currency (LKR) Module', () => {
  describe('parseLKR', () => {
    it('parses strings with Rs., LKR, Sinhala and Tamil symbols', () => {
      expect(parseLKR('Rs. 1,500.50')).toBe(1500.5);
      expect(parseLKR('Rs 1500.50')).toBe(1500.5);
      expect(parseLKR('LKR 2,500.00')).toBe(2500);
      expect(parseLKR('රු. 500.25')).toBe(500.25);
      expect(parseLKR('ரூ. 1000')).toBe(1000);
      expect(parseLKR('1500.50')).toBe(1500.5);
      expect(parseLKR(1500)).toBe(1500);
    });

    it('parses South Asian comma format (1,50,000)', () => {
      expect(parseLKR('1,50,000')).toBe(150000);
    });

    it('handles negative amounts', () => {
      expect(parseLKR('-Rs. 500')).toBe(-500);
      expect(parseLKR('(500)')).toBe(-500);
    });

    it('returns null on invalid input', () => {
      expect(parseLKR('abc')).toBeNull();
      expect(parseLKR('')).toBeNull();
    });
  });

  describe('isValidLKR', () => {
    it('validates positive and bounded amounts', () => {
      expect(isValidLKR('Rs. 1,500.00')).toBe(true);
      expect(isValidLKR('-500')).toBe(false);
      expect(isValidLKR('-500', { allowNegative: true })).toBe(true);
      expect(isValidLKR('100', { min: 200 })).toBe(false);
      expect(isValidLKR('300', { max: 200 })).toBe(false);
    });
  });

  describe('formatLKR', () => {
    it('formats Western standard currency', () => {
      expect(formatLKR(1500.5)).toBe('Rs. 1,500.50');
      expect(formatLKR(2500, { symbol: 'LKR' })).toBe('LKR 2,500.00');
      expect(formatLKR(250, { symbol: 'රු.' })).toBe('රු. 250.00');
    });

    it('formats with South Asian lakh scale', () => {
      expect(formatLKR(1500000, { lakhScale: true })).toBe('Rs. 15,00,000.00');
      expect(formatLKR(1234567.89, { lakhScale: true })).toBe('Rs. 12,34,567.89');
      expect(formatLKR(500, { lakhScale: true })).toBe('Rs. 500.00');
    });

    it('formats negative amounts with lakh scale', () => {
      expect(formatLKR(-1500000, { lakhScale: true })).toBe('Rs. -15,00,000.00');
      expect(formatLKR(-500, { lakhScale: true })).toBe('Rs. -500.00');
    });

    it('formats lakh scale without decimals', () => {
      expect(formatLKR(500, { lakhScale: true, decimals: 0 })).toBe('Rs. 500');
      expect(formatLKR(1500000, { lakhScale: true, decimals: 0 })).toBe('Rs. 15,00,000');
    });

    it('formats without grouping', () => {
      expect(formatLKR(1500000, { useGrouping: false })).toBe('Rs. 1500000.00');
    });

    it('supports symbol suffix', () => {
      expect(formatLKR(500, { symbol: 'LKR', symbolPosition: 'suffix' })).toBe('500.00 LKR');
    });

    it('omits the symbol when it is empty', () => {
      expect(formatLKR(1500, { symbol: '' })).toBe('1,500.00');
      expect(formatLKR(1500, { symbol: '', symbolPosition: 'suffix' })).toBe('1,500.00');
    });
  });

  describe('lkrToWords (Number to Words)', () => {
    it('converts to English words', () => {
      expect(lkrToWords(1500)).toBe('One Thousand Five Hundred Rupees Only');
      expect(lkrToWords(1500.5)).toBe('One Thousand Five Hundred Rupees and Fifty Cents Only');
      expect(lkrToWords(1)).toBe('One Rupee Only');
      expect(lkrToWords(0)).toBe('Zero Rupees Only');
    });

    it('supports a custom suffix', () => {
      expect(lkrToWords(1500, { suffix: '' })).toBe('One Thousand Five Hundred Rupees');
    });

    it('converts to Sinhala words', () => {
      const wordsSi = lkrToWords(1500, { language: 'si' });
      expect(wordsSi).toContain('රුපියල්');
      expect(wordsSi).toContain('එක්දහස්');
      expect(wordsSi).toContain('පන්සිය');

      const withCentsSi = lkrToWords(1500.5, { language: 'si' });
      expect(withCentsSi).toContain('ශත');
    });

    it('converts zero, thousands, and negatives to Sinhala words', () => {
      expect(lkrToWords(0, { language: 'si' })).toBe('රුපියල් බිංදුවයි');
      expect(lkrToWords(1000, { language: 'si' })).toBe('රුපියල් එක්දහස්යි');
      expect(lkrToWords(-5, { language: 'si' })).toBe('සෘණ රුපියල් පහයි');
    });

    it('ends Sinhala amounts with the යි suffix', () => {
      expect(lkrToWords(1, { language: 'si' })).toBe('රුපියල් එකයි');
      expect(lkrToWords(3, { language: 'si' })).toBe('රුපියල් තුනයි');
      expect(lkrToWords(4, { language: 'si' })).toBe('රුපියල් හතරයි');
      expect(lkrToWords(8, { language: 'si' })).toBe('රුපියල් අටයි');
    });

    it('converts to Tamil words', () => {
      const wordsTa = lkrToWords(1500, { language: 'ta' });
      expect(wordsTa).toContain('ஆயிரத்து');
      expect(wordsTa).toContain('ரூபாய்');

      const withCentsTa = lkrToWords(1500.5, { language: 'ta' });
      expect(withCentsTa).toContain('சதம்');
    });

    it('converts zero, thousands, and negatives to Tamil words', () => {
      expect(lkrToWords(0, { language: 'ta' })).toBe('பூஜ்ஜியம் ரூபாய்');
      expect(lkrToWords(1000, { language: 'ta' })).toBe('ஆயிரம் ரூபாய்');
      expect(lkrToWords(2000, { language: 'ta' })).toBe('இரண்டு ஆயிரம் ரூபாய்');
      expect(lkrToWords(2500, { language: 'ta' })).toBe('இரண்டு ஆயிரத்து ஐந்நூறு ரூபாய்');
      expect(lkrToWords(-5, { language: 'ta' })).toBe('கழித்தல் ஐந்து ரூபாய்');
    });
  });

  describe('validateLKR result', () => {
    it('returns structured result', () => {
      const res = validateLKR('Rs. 1,500.00');
      expect(res.isValid).toBe(true);
      expect(res.data).toBe(1500);

      const err = validateLKR('invalid');
      expect(err.isValid).toBe(false);
      expect(err.code).toBe('CURRENCY_INVALID');
    });

    it('rejects negative amounts unless allowed', () => {
      expect(validateLKR('-500').code).toBe('CURRENCY_NEGATIVE');
      expect(validateLKR('(1,500)').code).toBe('CURRENCY_NEGATIVE');
      expect(validateLKR('-500', { allowNegative: true }).data).toBe(-500);
    });

    it('applies the maximum amount', () => {
      expect(validateLKR('300', { max: 200 }).code).toBe('CURRENCY_EXCEEDS_MAX');
      expect(validateLKR('150', { max: 200 }).data).toBe(150);
    });
  });
});
