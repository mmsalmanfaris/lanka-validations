export interface ReferenceSource {
  authority: string;
  title: string;
  url: string;
}

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

export type ReferenceTableId =
  | 'PROVINCES' | 'DISTRICTS' | 'CBSL_BANKS' | 'POSTAL_PREFIXES' | 'MAJOR_CITIES'
  | 'MOBILE_PREFIXES' | 'AREA_CODES' | 'FIXED_OPERATOR_DIGITS' | 'SRI_LANKA_SHORT_CODES'
  | 'DMT_LICENSE_CATEGORIES' | 'VEHICLE_PROVINCES';
