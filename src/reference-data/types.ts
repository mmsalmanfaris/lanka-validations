/** An official publication a reference table is based on. */
export interface ReferenceSource {
  authority: string;
  title: string;
  url: string;
}

/** Where a bundled reference table comes from, when it was last checked, and what it does not cover. */
export interface ReferenceTableMetadata {
  table: string;
  version: string;
  lastVerified: string;
  coverage: string;
  provenance: string;
  sources: readonly ReferenceSource[];
  limitations: readonly string[];
  updateProcess: readonly string[];
}

/** Name of a bundled reference table, as accepted by {@link getReferenceDataMetadata}. */
export type ReferenceTableId =
  | 'PROVINCES'
  | 'DISTRICTS'
  | 'CBSL_BANKS'
  | 'POSTAL_PREFIXES'
  | 'MAJOR_CITIES'
  | 'MOBILE_PREFIXES'
  | 'AREA_CODES'
  | 'FIXED_OPERATOR_DIGITS'
  | 'SRI_LANKA_SHORT_CODES'
  | 'DMT_LICENSE_CATEGORIES'
  | 'VEHICLE_PROVINCES'
  | 'NIC_FORMAT';
