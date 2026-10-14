/** Currency symbols accepted by {@link formatLKR}. An empty string formats the number without a symbol. */
export type LkrSymbol = 'Rs.' | 'Rs' | 'රු.' | 'ரூ.' | 'LKR' | '';

/** Language for {@link lkrToWords}: English, Sinhala, or Tamil. */
export type CurrencyLocale = 'en' | 'si' | 'ta';

/** Options for {@link formatLKR}. */
export interface FormatLkrOptions {
  /** Symbol prefix or suffix. Default: 'Rs. ' */
  symbol?: LkrSymbol;
  /** Position of symbol: 'prefix' or 'suffix'. Default: 'prefix' */
  symbolPosition?: 'prefix' | 'suffix';
  /** Number of decimal places. Default: 2 */
  decimals?: number;
  /** Whether to use thousand/lakh separators. Default: true */
  useGrouping?: boolean;
  /** Whether to use South Asian grouping format (e.g., 1,00,000 instead of 100,000). Default: false */
  lakhScale?: boolean;
}

/** Options for {@link lkrToWords}. */
export interface WordsOptions {
  /** Target language for number to words: 'en' (English), 'si' (Sinhala), or 'ta' (Tamil). Default: 'en' */
  language?: CurrencyLocale;
  /** Whether to include cents in words output. Default: true */
  includeCents?: boolean;
  /** Appends suffix, e.g. 'Only'. Default: 'Only' for English, '' for Sinhala/Tamil */
  suffix?: string;
}
