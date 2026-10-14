/** Date-only comparisons and ages use the UTC calendar date. */
export interface NicOptions {
  referenceDate?: Date;
}

/** NIC layout: `'old'` is 9 digits plus V or X, `'new'` is 12 digits. */
export type NicFormat = 'old' | 'new';
/** Gender encoded in an NIC. Female holders have 500 added to the day-of-year field. */
export type Gender = 'male' | 'female';

/** Everything decoded from a valid NIC by {@link parseNic}. */
export interface NicInfo {
  /** The standardized NIC string */
  nic: string;
  /** Format of the NIC: 'old' (9 digits + V/X) or 'new' (12 digits) */
  format: NicFormat;
  /** 4-digit birth year */
  year: number;
  /** Day of the year (1 - 366) */
  dayOfYear: number;
  /** Gender derived from NIC */
  gender: Gender;
  /** UTC Date of Birth */
  dob: Date;
  /** Formatted ISO Date of Birth (YYYY-MM-DD) */
  dobString: string;
  /** Current age in full years */
  age: number;
  /** Serial number segment */
  serial: string;
  /** Check digit */
  checkDigit: number;
  /** Voting eligibility (true for 'V', false for 'X', null for 12-digit) */
  isVoter: boolean | null;
  /** Standardized 12-digit equivalent */
  newNic: string;
  /** Standardized 9-digit + V equivalent (if year 1900-1999) */
  oldNic: string | null;
}
