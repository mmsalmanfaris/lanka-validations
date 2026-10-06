export type PassportType = 'ordinary' | 'diplomatic' | 'official' | 'emergency' | 'unknown';

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
