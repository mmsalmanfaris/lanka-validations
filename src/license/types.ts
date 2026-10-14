/** Driving licence number layout: `'legacy'` (7 digits), `'smart_card_b'` (B followed by 7 digits), or `'nic_based'` (the holder's NIC number). */
export type LicenseFormat = 'legacy' | 'smart_card_b' | 'nic_based';

/** A DMT driving licence vehicle class. */
export interface LicenseCategoryInfo {
  category: string;
  name: string;
  description: string;
  minAge: number;
}

/** Details of a valid driving licence number, returned by {@link parseDrivingLicense}. */
export interface DrivingLicenseInfo {
  /** Cleaned license string */
  license: string;
  /** Format of license number */
  format: LicenseFormat;
  /** Number portion */
  number: string;
  /** If NIC-based, whether it is old or new NIC */
  nicFormat?: 'old' | 'new';
}
