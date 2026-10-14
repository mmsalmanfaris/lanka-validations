/** Passport category inferred from the letter prefix. `unknown` means the prefix is not one this library recognises. */
export type PassportType = 'ordinary' | 'diplomatic' | 'official' | 'emergency' | 'unknown';

/** Details of a valid passport number, returned by {@link parsePassport}. The type is inferred from the prefix only and is not verified. */
export interface PassportInfo {
  /** Cleaned passport number string */
  passport: string;
  /** Passport type classification */
  type: PassportType;
  /** Series prefix letter(s) */
  prefix: string;
  /** Numeric digits part */
  number: string;
  /** Whether the passport matches the new e-Passport pattern */
  isEPassport: boolean;
}
