export type LicenseFormat = 'legacy' | 'smart_card_b' | 'nic_based';

export interface LicenseCategoryInfo {
  category: string;
  name: string;
  description: string;
  minAge: number;
}

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
