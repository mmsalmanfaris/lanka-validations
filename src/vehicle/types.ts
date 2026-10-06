export type VehiclePlateEra =
  | 'modern'
  | 'modern_numeric'
  | 'sri_series'
  | 'vintage';

export interface VehiclePlateInfo {
  /** Cleaned plate string */
  plate: string;
  /** Registration era */
  era: VehiclePlateEra;
  /** 2-letter province code if present (e.g. 'WP', 'CP') */
  provinceCode: string | null;
  /** Full English province name if province code is present */
  provinceName: string | null;
  /** Series letters or vintage number prefix (e.g. 'CAB', 'BZ', '14 Sri') */
  series: string;
  /** Sequential number part (e.g. '1234') */
  number: string;
  /** Standardized pretty format (e.g. 'WP CAB-1234') */
  formatted: string;
}

