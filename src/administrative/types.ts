/** A Sri Lankan province with its names and districts. */
export interface ProvinceInfo {
  code: string;
  name: string;
  nameSi: string;
  nameTa: string;
  districts: string[];
}

/** A Sri Lankan district with its names and province. */
export interface DistrictInfo {
  name: string;
  nameSi: string;
  nameTa: string;
  provinceCode: string;
  provinceName: string;
}

/** Immutable public reference-table record, including its nested district list. */
export type ReadonlyProvinceInfo = Readonly<Omit<ProvinceInfo, 'districts'>> & {
  readonly districts: readonly string[];
};
