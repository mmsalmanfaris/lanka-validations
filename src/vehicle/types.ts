/** Plate numbering scheme: current letter series (`'modern'`), numeric series (`'modern_numeric'`), the 1956-2000 'Sri' series, or pre-1956 vintage plates. */
export type VehiclePlateEra = 'modern' | 'modern_numeric' | 'sri_series' | 'vintage';

/** Details of a valid vehicle registration plate, returned by {@link parseVehiclePlate}. */
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
